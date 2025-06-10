import { useState, useRef, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, ClockIcon, ExclamationIcon, DocumentIcon } from '@heroicons/react/outline';
import { useTranslation } from 'next-i18next';
import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import ModalWizardVerification from './ModalWizardVerification';

function isImage(url) {
  return /\.(jpg|jpeg|png|gif)$/i.test(url);
}

export default function AccountVerification({ verificationStatus, onSubmitted }) {
  const { t } = useTranslation('common');
  const [document, setDocument] = useState(null);
  const [proof, setProof] = useState(null);
  const [selfie, setSelfie] = useState(null);
  const [selfiePreview, setSelfiePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [verificationData, setVerificationData] = useState(null);
  const [lastStatus, setLastStatus] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ type: '', url: '' });
  const [wizardOpen, setWizardOpen] = useState(false);

  useEffect(() => {
    async function fetchVerification() {
      const token = localStorage.getItem('token');
      if (!token) return;
      const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const user = await res.json();
        setVerificationData(user.accountVerification || null);
      }
    }
    fetchVerification();
  }, []);

  useEffect(() => {
    if (verificationData && lastStatus && verificationData.status !== lastStatus) {
      if (verificationData.status === 'APPROVED') {
        toast.success(t('accountVerification.approved'));
      } else if (verificationData.status === 'REJECTED') {
        toast.error(t('accountVerification.rejected'));
      } else if (verificationData.status === 'PENDING') {
        toast(t('accountVerification.pending'));
      }
    }
    if (verificationData) setLastStatus(verificationData.status);
  }, [verificationData, lastStatus, t]);

  // Captura selfie da câmera
  const startCamera = async () => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
    }
  };
  const takeSelfie = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video.srcObject) {
      toast.error(t('accountVerification.openCameraFirst'));
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (blob) {
        setSelfie(blob);
        setSelfiePreview(URL.createObjectURL(blob));
      } else {
        toast.error(t('accountVerification.selfieError'));
      }
    }, 'image/jpeg');
    // Parar a câmera
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
      setCameraActive(false);
    }
  };

  const handleFileChange = (e, setter) => {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!document || !proof || !selfie) {
      toast.error(t('accountVerification.allFilesRequired'));
      return;
    }
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('document', document);
      formData.append('proofOfAddress', proof);
      formData.append('selfie', selfie);
      const res = await fetch('/api/v1/users/account-verification', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        toast.success(t('accountVerification.submitted'));
        // Atualizar status e arquivos após envio
        const meRes = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
        if (meRes.ok) {
          const user = await meRes.json();
          setVerificationData(user.accountVerification || null);
        }
        if (onSubmitted) onSubmitted();
      } else {
        const data = await res.json();
        toast.error(data.message || t('accountVerification.submitError'));
      }
    } catch (err) {
      toast.error(t('accountVerification.submitError'));
    } finally {
      setLoading(false);
    }
  };

  // Condições para exibir formulário
  const canSubmit = !verificationData || verificationData.status === 'REJECTED';

  function openPreview(url, type) {
    setModalContent({ url, type });
    setModalOpen(true);
  }
  function closePreview() {
    setModalOpen(false);
    setModalContent({ type: '', url: '' });
  }

  async function handleDeleteFile(fileType) {
    if (!window.confirm(t('accountVerification.confirmDelete'))) return;
    const token = localStorage.getItem('token');
    const res = await fetch('/api/v1/users/account-verification', {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fileType }),
    });
    if (res.ok) {
      toast.success(t('accountVerification.fileDeleted'));
      // Atualizar dados
      const meRes = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
      if (meRes.ok) {
        const user = await meRes.json();
        setVerificationData(user.accountVerification || null);
      }
    } else {
      const data = await res.json();
      toast.error(data.message || t('accountVerification.deleteError'));
    }
  }

  // Novo: upload individual
  async function handleUploadIndividual(fileType, file) {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append(fileType, file);
      // Envia apenas o arquivo individual
      const res = await fetch('/api/v1/users/account-verification', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });
      if (res.ok) {
        toast.success(t('accountVerification.submitted'));
        const meRes = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
        if (meRes.ok) {
          const user = await meRes.json();
          setVerificationData(user.accountVerification || null);
        }
        if (onSubmitted) onSubmitted();
      } else {
        const data = await res.json();
        toast.error(data.message || t('accountVerification.submitError'));
      }
    } catch (err) {
      toast.error(t('accountVerification.submitError'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">{t('accountVerification.title')}</h2>
      {/* Banner de status */}
      {verificationData?.status === 'APPROVED' && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 flex items-center mb-4">
          <CheckCircleIcon className="h-6 w-6 mr-2 text-green-500" />
          <span>{t('accountVerification.approved')}</span>
        </div>
      )}
      {verificationData?.status === 'PENDING' && (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 flex items-center mb-4">
          <ClockIcon className="h-6 w-6 mr-2 text-yellow-500" />
          <span>{t('accountVerification.pending')}</span>
        </div>
      )}
      {verificationData?.status === 'REJECTED' && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 flex items-center mb-4">
          <ExclamationIcon className="h-6 w-6 mr-2 text-red-500" />
          <span>
            {t('accountVerification.rejected')}: <b>{verificationData.rejectionReason}</b>
            <br />
            {t('accountVerification.resubmitInstruction')}
          </span>
        </div>
      )}
      {/* Botão para abrir modal wizard */}
      <div className="mb-4 flex justify-end">
        <button
          className="bg-indigo-600 text-white px-4 py-2 rounded font-bold shadow hover:bg-indigo-700 transition"
          onClick={() => setWizardOpen(true)}
        >
          {t('accountVerification.verifyButton')}
        </button>
      </div>
      {/* Detalhes dos arquivos enviados (mantém para histórico/visualização) */}
      {verificationData && (
        <div className="mb-4">
          <div className="font-semibold mb-2">{t('accountVerification.currentStatus')}: <span className={
            verificationData.status === 'APPROVED' ? 'text-green-600' : verificationData.status === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
          }>{verificationData.status}</span></div>
          <div className="flex flex-col gap-4">
            {/* Documento */}
            <div className="border-b pb-2 mb-2">
              <div className="font-semibold">{t('accountVerification.document')}:</div>
              {verificationData.documentUrl ? (
                <span className="flex items-center gap-2">
                  {isImage(verificationData.documentUrl) ? (
                    <img src={verificationData.documentUrl} alt="Document preview" className="h-16 w-auto inline-block mr-2 border rounded cursor-pointer" style={{maxWidth: '100px'}} onClick={() => openPreview(verificationData.documentUrl, 'image')} />
                  ) : (
                    <span className="text-blue-600 underline flex items-center cursor-pointer" onClick={() => openPreview(verificationData.documentUrl, 'pdf')}>
                      <DocumentIcon className="h-5 w-5 mr-1 inline-block" /> {t('accountVerification.view')}
                    </span>
                  )}
                  <span>Status: <span className={
                    verificationData.documentStatus === 'APPROVED' ? 'text-green-600' : verificationData.documentStatus === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                  }>{verificationData.documentStatus}</span></span>
                  {verificationData.documentRejectionReason && (
                    <span className="text-red-600 ml-2">Motivo: {verificationData.documentRejectionReason}</span>
                  )}
                  {(verificationData.documentStatus === 'REJECTED' || !verificationData.documentUrl) && (
                    <>
                      <input type="file" accept="image/*,application/pdf" onChange={e => handleUploadIndividual('document', e.target.files[0])} disabled={loading} />
                      <button className="ml-2 text-red-600 hover:text-red-800" onClick={() => handleDeleteFile('document')} title="Excluir" disabled={loading}>&#128465;</button>
                    </>
                  )}
                </span>
              ) : (
                <span className="text-gray-500">Não enviado</span>
              )}
            </div>
            {/* Comprovante de Endereço */}
            <div className="border-b pb-2 mb-2">
              <div className="font-semibold">{t('accountVerification.proofOfAddress')}:</div>
              {verificationData.proofOfAddressUrl ? (
                <span className="flex items-center gap-2">
                  {isImage(verificationData.proofOfAddressUrl) ? (
                    <img src={verificationData.proofOfAddressUrl} alt="Proof preview" className="h-16 w-auto inline-block mr-2 border rounded cursor-pointer" style={{maxWidth: '100px'}} onClick={() => openPreview(verificationData.proofOfAddressUrl, 'image')} />
                  ) : (
                    <span className="text-blue-600 underline flex items-center cursor-pointer" onClick={() => openPreview(verificationData.proofOfAddressUrl, 'pdf')}>
                      <DocumentIcon className="h-5 w-5 mr-1 inline-block" /> {t('accountVerification.view')}
                    </span>
                  )}
                  <span>Status: <span className={
                    verificationData.proofOfAddressStatus === 'APPROVED' ? 'text-green-600' : verificationData.proofOfAddressStatus === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                  }>{verificationData.proofOfAddressStatus}</span></span>
                  {verificationData.proofOfAddressRejectionReason && (
                    <span className="text-red-600 ml-2">Motivo: {verificationData.proofOfAddressRejectionReason}</span>
                  )}
                  {(verificationData.proofOfAddressStatus === 'REJECTED' || !verificationData.proofOfAddressUrl) && (
                    <>
                      <input type="file" accept="image/*,application/pdf" onChange={e => handleUploadIndividual('proofOfAddress', e.target.files[0])} disabled={loading} />
                      <button className="ml-2 text-red-600 hover:text-red-800" onClick={() => handleDeleteFile('proofOfAddress')} title="Excluir" disabled={loading}>&#128465;</button>
                    </>
                  )}
                </span>
              ) : (
                <span className="text-gray-500">Não enviado</span>
              )}
            </div>
            {/* Selfie */}
            <div>
              <div className="font-semibold">{t('accountVerification.selfie')}:</div>
              {verificationData.selfieUrl ? (
                <span className="flex items-center gap-2">
                  <img src={verificationData.selfieUrl} alt="Selfie preview" className="h-16 w-auto inline-block mr-2 border rounded cursor-pointer" style={{maxWidth: '100px'}} onClick={() => openPreview(verificationData.selfieUrl, 'image')} />
                  <span>Status: <span className={
                    verificationData.selfieStatus === 'APPROVED' ? 'text-green-600' : verificationData.selfieStatus === 'REJECTED' ? 'text-red-600' : 'text-yellow-600'
                  }>{verificationData.selfieStatus}</span></span>
                  {verificationData.selfieRejectionReason && (
                    <span className="text-red-600 ml-2">Motivo: {verificationData.selfieRejectionReason}</span>
                  )}
                  {(verificationData.selfieStatus === 'REJECTED' || !verificationData.selfieUrl) && (
                    <>
                      <input type="file" accept="image/*" onChange={e => handleUploadIndividual('selfie', e.target.files[0])} disabled={loading} />
                      <button className="ml-2 text-red-600 hover:text-red-800" onClick={() => handleDeleteFile('selfie')} title="Excluir" disabled={loading}>&#128465;</button>
                    </>
                  )}
                </span>
              ) : (
                <span className="text-gray-500">Não enviado</span>
              )}
            </div>
          </div>
        </div>
      )}
      {/* Instruções */}
      <div className="mb-4 text-gray-700">
        {t('accountVerification.instructions')}
      </div>
      {/* Formulário só se nunca enviado ou rejeitado */}
      {canSubmit && (
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block font-bold mb-1">{t('accountVerification.documentLabel')}</label>
            <input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, setDocument)} />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">{t('accountVerification.proofOfAddressLabel')}</label>
            <input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, setProof)} />
          </div>
          <div className="mb-4">
            <label className="block font-bold mb-1">{t('accountVerification.selfieLabel')}</label>
            {selfiePreview ? (
              <img src={selfiePreview} alt="Selfie preview" className="w-32 h-32 object-cover rounded-full mb-2" />
            ) : null}
            <div className="flex gap-2 items-center">
              <button type="button" className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={startCamera}>{t('accountVerification.openCamera')}</button>
              <button type="button" className="bg-green-600 text-white px-3 py-1 rounded" onClick={takeSelfie} disabled={!cameraActive}>{t('accountVerification.takeSelfie')}</button>
            </div>
            <video ref={videoRef} className="w-32 h-32 mt-2 rounded" autoPlay style={{ display: 'block' }} />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
          </div>
          <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">
            {loading ? t('accountVerification.submitting') : t('accountVerification.submitButton')}
          </button>
        </form>
      )}
      {/* Modal de preview */}
      <Dialog as={Fragment} open={modalOpen} onClose={closePreview}>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <Dialog.Panel className="bg-white rounded-lg shadow-lg p-4 max-w-lg w-full relative">
            <button className="absolute top-2 right-2 text-gray-500" onClick={closePreview}>&times;</button>
            {modalContent.type === 'image' && (
              <img src={modalContent.url} alt="Preview" className="max-w-full max-h-[70vh] mx-auto" />
            )}
            {modalContent.type === 'pdf' && (
              <iframe src={modalContent.url} title="PDF Preview" className="w-full h-[70vh]" />
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
      {/* Modal Wizard de Verificação */}
      <ModalWizardVerification
        open={wizardOpen}
        onClose={async () => {
          setWizardOpen(false);
          // Atualizar status após fechar modal
          const token = localStorage.getItem('token');
          if (token) {
            const res = await fetch('/api/me', { headers: { Authorization: `Bearer ${token}` } });
            if (res.ok) {
              const user = await res.json();
              setVerificationData(user.accountVerification || null);
            }
          }
        }}
      />
    </div>
  );
} 