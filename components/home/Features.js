import { useTranslation } from 'next-i18next';
import {
  CurrencyDollarIcon,
  VideoCameraIcon,
  SparklesIcon,
  CalendarIcon,
} from '@heroicons/react/outline';

const features = [
  {
    name: 'feature1',
    description: 'feature1.description',
    icon: CurrencyDollarIcon,
  },
  {
    name: 'feature2',
    description: 'feature2.description',
    icon: VideoCameraIcon,
  },
  {
    name: 'feature3',
    description: 'feature3.description',
    icon: SparklesIcon,
  },
  {
    name: 'feature4',
    description: 'feature4.description',
    icon: CalendarIcon,
  },
];

export default function Features() {
  const { t } = useTranslation('common');

  return (
    <div className="py-12 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:text-center">
          <h2 className="text-base text-primary font-semibold tracking-wide uppercase">
            {t('features.title')}
          </h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            {t('features.subtitle')}
          </p>
        </div>

        <div className="mt-10">
          <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-primary text-white">
                  <feature.icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <div className="ml-16">
                  <dt className="text-lg leading-6 font-medium text-gray-900">
                    {t(`features.${feature.name}.title`)}
                  </dt>
                  <dd className="mt-2 text-base text-gray-500">
                    {t(`features.${feature.name}.description`)}
                  </dd>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 