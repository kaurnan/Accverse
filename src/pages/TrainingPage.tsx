
import { Play } from 'lucide-react';

interface TrainingVideo {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  duration: string;
  category: string;
}

const trainingVideos: TrainingVideo[] = [
  {
    id: '1',
    title: 'Introduction to Tax Filing',
    description: 'Learn the basics of personal tax filing and important deadlines.',
    thumbnailUrl: '/images/tax-filing-thumb.jpg',
    videoUrl: '/videos/tax-filing-intro.mp4',
    duration: '15:30',
    category: 'Tax Basics'
  },
  {
    id: '2', 
    title: 'Business Accounting 101',
    description: 'Essential accounting concepts for small business owners.',
    thumbnailUrl: '/images/accounting-thumb.jpg',
    videoUrl: '/videos/accounting-basics.mp4',
    duration: '22:45',
    category: 'Accounting'
  },
  {
    id: '3',
    title: 'Understanding Tax Deductions',
    description: 'A comprehensive guide to common tax deductions and credits.',
    thumbnailUrl: '/images/deductions-thumb.jpg',
    videoUrl: '/videos/tax-deductions.mp4',
    duration: '18:15',
    category: 'Tax Planning'
  }
];

const TrainingPage = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Training Resources</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Enhance your knowledge with our collection of educational videos covering tax, accounting, and financial topics.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trainingVideos.map((video) => (
            <div key={video.id} className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="relative">
                <img 
                  src={video.thumbnailUrl} 
                  alt={video.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <Play className="h-12 w-12 text-white opacity-80 hover:opacity-100 cursor-pointer" />
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-75 text-white text-sm px-2 py-1 rounded">
                  {video.duration}
                </div>
              </div>
              <div className="p-6">
                <div className="text-sm text-blue-600 font-semibold mb-2">{video.category}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{video.title}</h3>
                <p className="text-gray-600">{video.description}</p>
                <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700">
                  Watch Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrainingPage;
