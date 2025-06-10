import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import Layout from '../components/layout/Layout';
import Link from 'next/link';
import {
  CalendarIcon,
  UserIcon,
  TagIcon,
  ArrowRightIcon,
} from '@heroicons/react/outline';

export default function Blog() {
  const { t } = useTranslation('common');

  const blogPosts = [
    {
      title: 'How to Succeed as a Freelancer in 2024',
      excerpt: 'Learn the essential strategies and tools to thrive in the freelance market this year.',
      author: 'Sarah Johnson',
      date: 'Jan 15, 2024',
      category: 'Freelancing Tips',
      image: '/images/blog/freelancer-success.jpg',
      slug: 'how-to-succeed-as-freelancer-2024',
    },
    {
      title: 'The Future of Remote Work: Trends and Predictions',
      excerpt: 'Explore the latest trends in remote work and what the future holds for freelancers and clients.',
      author: 'Michael Chen',
      date: 'Jan 10, 2024',
      category: 'Industry Insights',
      image: '/images/blog/remote-work-future.jpg',
      slug: 'future-of-remote-work-trends',
    },
    {
      title: 'AI Tools Every Freelancer Should Use',
      excerpt: 'Discover the most powerful AI tools that can help you work smarter and faster.',
      author: 'Emma Davis',
      date: 'Jan 5, 2024',
      category: 'Technology',
      image: '/images/blog/ai-tools-freelancers.jpg',
      slug: 'ai-tools-for-freelancers',
    },
    {
      title: 'Building a Strong Client-Freelancer Relationship',
      excerpt: 'Learn how to establish and maintain successful relationships with your clients.',
      author: 'David Wilson',
      date: 'Dec 30, 2023',
      category: 'Client Relations',
      image: '/images/blog/client-relationship.jpg',
      slug: 'building-client-freelancer-relationship',
    },
    {
      title: 'The Rise of Cryptocurrency in Freelancing',
      excerpt: 'How digital currencies are changing the way freelancers get paid and manage their finances.',
      author: 'Lisa Thompson',
      date: 'Dec 25, 2023',
      category: 'Finance',
      image: '/images/blog/crypto-freelancing.jpg',
      slug: 'cryptocurrency-in-freelancing',
    },
    {
      title: 'Essential Skills for Freelancers in 2024',
      excerpt: 'Stay competitive by developing these in-demand skills for the freelance market.',
      author: 'James Anderson',
      date: 'Dec 20, 2023',
      category: 'Career Development',
      image: '/images/blog/essential-skills.jpg',
      slug: 'essential-skills-freelancers-2024',
    },
  ];

  return (
    <Layout>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Blog
            </h1>
            <p className="mt-4 text-lg text-gray-500">
              Insights, tips, and industry news for freelancers and clients
            </p>
          </div>

          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <article key={post.slug} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                <div className="flex-shrink-0">
                  <img
                    className="h-48 w-full object-cover"
                    src={post.image}
                    alt={post.title}
                  />
                </div>
                <div className="flex flex-1 flex-col justify-between bg-white p-6">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <TagIcon className="h-5 w-5 text-primary" />
                      <span className="ml-2 text-sm font-medium text-primary">
                        {post.category}
                      </span>
                    </div>
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="mt-2 block"
                    >
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="mt-3 text-base text-gray-500">{post.excerpt}</p>
                  </div>
                  <div className="mt-6 flex items-center">
                    <div className="flex-shrink-0">
                      <UserIcon className="h-10 w-10 text-gray-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">{post.author}</p>
                      <div className="flex space-x-1 text-sm text-gray-500">
                        <CalendarIcon className="h-5 w-5" />
                        <time dateTime={post.date}>{post.date}</time>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <Link 
                      href={`/blog/${post.slug}`} 
                      className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark"
                    >
                      Read more
                      <ArrowRightIcon className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-12 text-center">
            <button
              type="button"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Load More Posts
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
} 