import React from 'react';
import { Table } from 'antd';

const ImageDetailsTable = ({ data }) => {
  const columns = [
    { title: 'Image Name', dataIndex: 'imageName', key: 'imageName' },
    { title: 'Alt Text', dataIndex: 'alt', key: 'alt', render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} /> },
  ];

  return (
    <Table
      dataSource={data.map((image, index) => ({ key: index, ...image }))}
      columns={columns}
      pagination={false}
      style={{ marginTop: 20 }}
    />
  );
};

export default ImageDetailsTable;
