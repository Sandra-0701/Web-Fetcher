import React from 'react';
import { Table } from 'antd';

const VideoDetailsTable = ({ data }) => {
  // Columns definition
  const columns = [
    { 
      title: 'Transcript', 
      dataIndex: 'transcript', 
      key: 'transcript',
      render: text => (Array.isArray(text) && text.length > 0 ? text.join(', ') : 'None'),
    },
    { 
      title: 'CC', 
      dataIndex: 'cc', 
      key: 'cc',
      render: text => (Array.isArray(text) && text.length > 0 ? text.join(', ') : 'None'),
    },
    { title: 'Autoplay', dataIndex: 'autoplay', key: 'autoplay' },
    { title: 'Muted', dataIndex: 'muted', key: 'muted' },
    { title: 'ARIA Label', dataIndex: 'ariaLabel', key: 'ariaLabel' },
    { title: 'Audio Track Present', dataIndex: 'audioTrack', key: 'audioTrack' },
  ];

  // Ensure data is an array and has correct structure
  const dataSource = Array.isArray(data) ? data.map((video, index) => ({
    key: index, // Unique key for each row
    transcript: video.transcript || [], // Default to empty array if not present
    cc: video.cc || [], // Default to empty array if not present
    autoplay: video.autoplay || 'no', // Default to 'no' if not present
    muted: video.muted || 'no', // Default to 'no' if not present
    ariaLabel: video.ariaLabel || 'N/A', // Default to 'N/A' if not present
    audioTrack: video.audioTrack || 'no', // Default to 'no' if not present
  })) : [];

  return (
    <Table
      dataSource={dataSource} // Set the dataSource for the table
      columns={columns}       // Set the columns configuration
      pagination={false}      // Disable pagination
      style={{ marginTop: 20 }} // Add margin for spacing
    />
  );
};

export default VideoDetailsTable;
