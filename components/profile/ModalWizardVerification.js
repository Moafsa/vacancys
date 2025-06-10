import { useState, useRef } from 'react';
import { Dialog } from '@headlessui/react';
import { Fragment } from 'react';
import { toast } from 'react-hot-toast';

const steps = [
  { key: 'document', label: 'Document' },
  { key: 'proof', label: 'Proof of Address' },
  { key: 'selfie', label: 'Selfie' },
  { key: 'summary', label: 'Summary' },
];

export default function ModalWizardVerification({ open, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [documentFile, setDocumentFile] = useState(null);
  const [proofFile, setProofFile] = useState(null);
  const [selfieBlob, setSelfieBlob] = useState(null);
  const [status, setStatus] = useState({
    document: { status: 'PENDING', reason: '' },
    proof: { status: 'PENDING', reason: '' },
    selfie: { status: 'PENDING', reason: '' },
  });
  const [loading, setLoading] = useState({ document: false, proof: false, selfie: false });
  // Webcam refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [cameraActive, setCameraActive] = useState(false);

  // Função utilitária para upload
  async function uploadFile(type, file) {
    setLoading(l => ({ ...l, [type]: true }));
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      if (type === 'document') formData.append('document', file);
      if (type === 'proof') formData.append('proofOfAddress', file);
      if (type === 'selfie') formData.append('selfie', file, 'selfie.jpg');
      const res = await fetch('/api/v1/users/account-verification', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.verification) {
        setStatus(s => ({
          ...s,
          document: {
            status: data.verification.documentStatus,
            reason: data.verification.documentRejectionReason || '',
          },
          proof: {
            status: data.verification.proofOfAddressStatus,
            reason: data.verification.proofOfAddressRejectionReason || '',
          },
          selfie: {
            status: data.verification.selfieStatus,
            reason: data.verification.selfieRejectionReason || '',
          },
        }));
        toast.success('File uploaded and verified!');
      } else {
        toast.error(data.message || 'Error uploading file');
      }
    } catch (err) {
      toast.error('Error uploading file');
    } finally {
      setLoading(l => ({ ...l, [type]: false }));
    }
  }

  // Webcam handlers
  async function startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      setCameraActive(true);
    }
  }
  function takeSelfie() {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video.srcObject) return;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);
    canvas.toBlob(blob => {
      if (blob) {
        setSelfieBlob(blob);
        uploadFile('selfie', blob);
      }
    }, 'image/jpeg');
    // Parar a câmera
    if (video.srcObject) {
      video.srcObject.getTracks().forEach(track => track.stop());
      video.srcObject = null;
      setCameraActive(false);
    }
  }

  function handleFileChange(e, setter, type) {
    if (e.target.files && e.target.files[0]) {
      setter(e.target.files[0]);
      uploadFile(type, e.target.files[0]);
    }
  }

  function getStatusColor(s) {
    if (s === 'APPROVED') return 'text-green-600';
    if (s === 'REJECTED') return 'text-red-600';
    return 'text-yellow-600';
  }

  function getOverallStatus() {
    if ([status.document.status, status.proof.status, status.selfie.status].includes('PENDING')) return 'PENDING';
    if ([status.document.status, status.proof.status, status.selfie.status].includes('REJECTED')) return 'PENDING';
    if ([status.document.status, status.proof.status, status.selfie.status].every(s => s === 'APPROVED')) return 'APPROVED';
    return 'PENDING';
  }

  return (
    <Dialog as={Fragment} open={open} onClose={onClose}>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
        <Dialog.Panel className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full relative">
          <button className="absolute top-2 right-2 text-gray-500" onClick={onClose}>&times;</button>
          <h2 className="text-xl font-bold mb-4">Account Verification</h2>
          <div className="flex justify-between mb-6">
            {steps.map((step, idx) => (
              <button
                key={step.key}
                className={`px-3 py-1 rounded font-semibold ${idx === currentStep ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'} mx-1`}
                onClick={() => setCurrentStep(idx)}
              >
                {step.label}
              </button>
            ))}
          </div>
          <div className="mb-6">
            {currentStep === 0 && (
              <div>
                <h3 className="font-semibold mb-2">Step 1: Document</h3>
                <p>Upload your identification document here.</p>
                <input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, setDocumentFile, 'document')} disabled={loading.document} />
                {documentFile && <div className="mt-2 text-sm text-gray-700">Selected: {documentFile.name}</div>}
                <div className={`mt-2 text-sm ${getStatusColor(status.document.status)}`}>Status: {status.document.status}</div>
                {status.document.reason && <div className="text-xs text-red-600">Reason: {status.document.reason}</div>}
                {loading.document && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
              </div>
            )}
            {currentStep === 1 && (
              <div>
                <h3 className="font-semibold mb-2">Step 2: Proof of Address</h3>
                <p>Upload your proof of address here.</p>
                <input type="file" accept="image/*,application/pdf" onChange={e => handleFileChange(e, setProofFile, 'proof')} disabled={loading.proof} />
                {proofFile && <div className="mt-2 text-sm text-gray-700">Selected: {proofFile.name}</div>}
                <div className={`mt-2 text-sm ${getStatusColor(status.proof.status)}`}>Status: {status.proof.status}</div>
                {status.proof.reason && <div className="text-xs text-red-600">Reason: {status.proof.reason}</div>}
                {loading.proof && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
              </div>
            )}
            {currentStep === 2 && (
              <div>
                <h3 className="font-semibold mb-2">Step 3: Selfie</h3>
                <p>Take a selfie using your webcam.</p>
                {!cameraActive && (
                  <button className="bg-indigo-600 text-white px-3 py-1 rounded" onClick={startCamera} disabled={loading.selfie}>Open Camera</button>
                )}
                {cameraActive && (
                  <button className="bg-green-600 text-white px-3 py-1 rounded ml-2" onClick={takeSelfie} disabled={loading.selfie}>Take Selfie</button>
                )}
                <div className="mt-2">
                  <video ref={videoRef} className="w-32 h-32 mt-2 rounded" autoPlay style={{ display: cameraActive ? 'block' : 'none' }} />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  {selfieBlob && (
                    <img src={URL.createObjectURL(selfieBlob)} alt="Selfie preview" className="w-32 h-32 object-cover rounded-full mt-2" />
                  )}
                </div>
                <div className={`mt-2 text-sm ${getStatusColor(status.selfie.status)}`}>Status: {status.selfie.status}</div>
                {status.selfie.reason && <div className="text-xs text-red-600">Reason: {status.selfie.reason}</div>}
                {loading.selfie && <div className="text-xs text-gray-500 mt-1">Uploading...</div>}
              </div>
            )}
            {currentStep === 3 && (
              <div>
                <h3 className="font-semibold mb-2">Summary</h3>
                <div className="mb-2">
                  <div className="font-semibold">Document: <span className={getStatusColor(status.document.status)}>{status.document.status}</span></div>
                  {status.document.reason && <div className="text-xs text-red-600">Reason: {status.document.reason}</div>}
                </div>
                <div className="mb-2">
                  <div className="font-semibold">Proof of Address: <span className={getStatusColor(status.proof.status)}>{status.proof.status}</span></div>
                  {status.proof.reason && <div className="text-xs text-red-600">Reason: {status.proof.reason}</div>}
                </div>
                <div className="mb-2">
                  <div className="font-semibold">Selfie: <span className={getStatusColor(status.selfie.status)}>{status.selfie.status}</span></div>
                  {status.selfie.reason && <div className="text-xs text-red-600">Reason: {status.selfie.reason}</div>}
                </div>
                <div className="mt-4">
                  <div className="font-bold">Overall Status: <span className={getStatusColor(getOverallStatus())}>{getOverallStatus()}</span></div>
                  {getOverallStatus() === 'APPROVED' ? (
                    <div className="text-green-700 mt-2">Your account is fully verified! You now have full access.</div>
                  ) : (
                    <div className="text-yellow-700 mt-2">Some steps are still pending or rejected. Please complete or re-upload the required documents.</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-between">
            <button
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded font-semibold"
              onClick={() => setCurrentStep(s => (s > 0 ? s - 1 : s))}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            {currentStep < steps.length - 1 ? (
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded font-semibold"
                onClick={() => setCurrentStep(s => (s < steps.length - 1 ? s + 1 : s))}
                disabled={currentStep === steps.length - 1}
              >
                Next
              </button>
            ) : (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded font-semibold"
                onClick={onClose}
              >
                Close
              </button>
            )}
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 