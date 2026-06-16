// src/pages/rokaPage/BlogDetail.jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const BlogDetail = () => {
  const { id } = useParams();

  const blogData = [
    {
      id: 1,
      title: "The Perfect Roka Ceremony Guide",
      subtitle: "Wedding Planning",
      description: "Everything you need to know about planning the perfect Roka ceremony.",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600",
      content: `<h2>The Roka Ceremony: A Sacred Beginning</h2><p>The Roka ceremony is one of the most cherished pre-wedding rituals in Indian culture.</p>`
    },
    {
      id: 2,
      title: "Roka Photography Tips",
      subtitle: "Photography Tips",
      description: "How to capture the most beautiful moments during your Roka ceremony.",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600",
      content: `<h2>Roka Photography Tips</h2><p>Capturing the perfect Roka ceremony requires skill and patience.</p>`
    },
    {
      id: 3,
      title: "Traditional Roka Rituals",
      subtitle: "Traditions",
      description: "Understanding the significance of each ritual in a Roka ceremony.",
      image: "https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=600",
      content: `<h2>Traditional Roka Rituals</h2><p>The Roka ceremony is steeped in tradition and cultural significance.</p>`
    }
  ];

  const blog = blogData.find((b) => b.id === parseInt(id));

  if (!blog) {
    return (
      <div style={{ padding: '40px', color: 'white', background: 'black', minHeight: '100vh' }}>
        <h1>Blog Not Found</h1>
        <a href="/roka" style={{ color: 'white' }}>Go Back</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px', color: 'white', background: 'black', minHeight: '100vh' }}>
      <h1>{blog.title}</h1>
      <p>{blog.subtitle}</p>
      <p>{blog.description}</p>
      <a href="/roka" style={{ color: 'white' }}>Go Back</a>
    </div>
  );
};

export default BlogDetail;  // ← ✅ YEH HONA CHAHIYE