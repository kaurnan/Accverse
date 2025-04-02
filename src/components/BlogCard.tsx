import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock } from 'lucide-react';

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  author: {
    name: string;
    avatar?: string;
  };
}

const BlogCard: React.FC<BlogCardProps> = ({
  id,
  title,
  excerpt,
  date,
  readTime,
  category,
  image,
  author,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md border border-gray-100 h-full flex flex-col">
      <Link to={`/insights/${id}`} className="block overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-105"
        />
      </Link>
      
      <div className="p-5 flex-grow flex flex-col">
        <div className="mb-3">
          <span className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
            {category}
          </span>
        </div>
        
        <Link to={`/insights/${id}`} className="block mb-2">
          <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 flex-grow">{excerpt}</p>
        
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex items-center">
            {author.avatar ? (
              <img 
                src={author.avatar} 
                alt={author.name} 
                className="w-8 h-8 rounded-full mr-2"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-2">
                <span className="text-sm font-medium">{author.name.charAt(0)}</span>
              </div>
            )}
            <span className="text-sm text-gray-700">{author.name}</span>
          </div>
          
          <div className="flex items-center text-gray-500 text-sm">
            <Calendar className="h-4 w-4 mr-1" />
            <span className="mr-3">{date}</span>
            <Clock className="h-4 w-4 mr-1" />
            <span>{readTime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogCard;