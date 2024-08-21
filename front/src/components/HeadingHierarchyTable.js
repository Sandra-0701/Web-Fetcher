import React from 'react';
import { Table } from 'antd';

const HeadingHierarchyTable = ({ data }) => {
  // Define columns to match the structure of the data received from the backend
  const columns = [
    { title: 'Level', dataIndex: 'level', key: 'level' },
    { title: 'Text', dataIndex: 'text', key: 'text' },
  ];

  // Map the data to include a key for each row
  const dataSource = data.map((heading, index) => ({
    key: index, // Unique key for each row
    level: heading.level, // Heading level (e.g., h1, h2, etc.)
    text: heading.text,   // Heading text
  }));

  return (
    <Table
      dataSource={dataSource}  // Set the dataSource for the table
      columns={columns}        // Set the columns configuration
      pagination={false}       // Disable pagination
      style={{ marginTop: 20 }} // Add margin for spacing
    />
  );
};

export default HeadingHierarchyTable;
