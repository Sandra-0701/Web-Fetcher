import React, { useState } from 'react';
import axios from 'axios';
import { Table, Button, Input, Select, Checkbox, message } from 'antd';
import * as XLSX from 'xlsx';
import './style.css';

const { Option } = Select;

// Define the function to get status color
const getStatusColor = (statusCode) => {
  if (statusCode >= 500) return 'red'; // Server errors
  if (statusCode >= 400) return 'orange'; // Client errors
  if (statusCode >= 300) return 'blue'; // Redirects
  return 'green'; // Successful responses
};

const App = () => {
  const [url, setUrl] = useState('');
  const [dataType, setDataType] = useState('all-details');
  const [includeUhf, setIncludeUhf] = useState(true);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [allDetails, setAllDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/${dataType}`, {
        url,
        includeUhf,
      });
      const responseData = response.data;

      // Set data and columns based on data type
      if (dataType === 'extract-urls') {
        setColumns([{ title: 'URL', dataIndex: 'url', key: 'url' }]);
        setData(responseData.urls?.map((url, index) => ({ key: index, url })) || []);
      } else if (dataType === 'link-details') {
        setColumns([
          { title: 'Link Type', dataIndex: 'linkType', key: 'linkType' },
          { title: 'Link Text', dataIndex: 'linkText', key: 'linkText', render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} /> },
          { title: 'ARIA Label', dataIndex: 'ariaLabel', key: 'ariaLabel' },
          { title: 'URL', dataIndex: 'url', key: 'url' },
          { title: 'Redirected URL', dataIndex: 'redirectedUrl', key: 'redirectedUrl' },
          { title: 'Status Code', dataIndex: 'statusCode', key: 'statusCode', render: (text, record) => <div style={{ color: getStatusColor(record.statusCode) }}>{text}</div> },
          { title: 'Target', dataIndex: 'target', key: 'target' },
        ]);
        setData(responseData.links?.map((link, index) => ({ key: index, ...link })) || []);
      } else if (dataType === 'image-details') {
        setColumns([
          { title: 'Image Name', dataIndex: 'imageName', key: 'imageName' },
          { title: 'Alt Text', dataIndex: 'alt', key: 'alt', render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} /> },
        ]);
        setData(responseData.images?.filter(image => image.imageName).map((image, index) => ({ key: index, ...image })) || []);
      } else if (dataType === 'video-details') {
        setColumns([
          { title: 'Transcript', dataIndex: 'transcript', key: 'transcript' },
          { title: 'CC', dataIndex: 'cc', key: 'cc' },
          { title: 'Autoplay', dataIndex: 'autoplay', key: 'autoplay' },
          { title: 'Muted', dataIndex: 'muted', key: 'muted' },
          { title: 'ARIA Label', dataIndex: 'ariaLabel', key: 'ariaLabel' },
          { title: 'Audio Track Present', dataIndex: 'audioTrack', key: 'audioTrack' },
        ]);
        setData(responseData.videos?.map((video, index) => ({ key: index, ...video })) || []);
      } else if (dataType === 'page-properties') {
        setColumns([
          { title: 'Name', dataIndex: 'name', key: 'name' },
          { title: 'Content', dataIndex: 'content', key: 'content' },
        ]);
        setData(responseData.metaTags?.map((meta, index) => ({ key: index, ...meta })) || []);
      } else if (dataType === 'heading-hierarchy') {
        setColumns([
          { title: 'Level', dataIndex: 'level', key: 'level' },
          { title: 'Text', dataIndex: 'text', key: 'text' },
        ]);
        setData(responseData.headings?.map((heading, index) => ({ key: index, ...heading })) || []);
      } else if (dataType === 'all-details') {
        setAllDetails(responseData);
      }
    } catch (error) {
      message.error('Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadExcel = () => {
    if (allDetails) {
      const sheetData = {
        'Link Details': allDetails.links || [],
        'Image Details': allDetails.images || [],
        'Video Details': allDetails.videos || [],
        'Page Properties': allDetails.pageProperties || [],
        'Heading Details': allDetails.headings || [],
      };

      const workbook = XLSX.utils.book_new();
      Object.keys(sheetData).forEach(sheetName => {
        const worksheet = XLSX.utils.json_to_sheet(sheetData[sheetName]);
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
      });
      XLSX.writeFile(workbook, 'data.xlsx');
    } else {
      message.error('No data available to download.');
    }
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Web Page Fetcher</h1>
      </div>
      <Input
        placeholder="Enter URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ marginBottom: 10 }}
      />
      <Select
        value={dataType}
        onChange={(value) => setDataType(value)}
        style={{ width: 200, marginBottom: 10 }}
      >
        <Option value="extract-urls">Extract URLs</Option>
        <Option value="link-details">Link Details</Option>
        <Option value="image-details">Image Details</Option>
        <Option value="video-details">Video Details</Option>
        <Option value="page-properties">Page Properties</Option>
        <Option value="heading-hierarchy">Heading Hierarchy</Option>
        <Option value="all-details">All Details</Option>
      </Select>
      <Checkbox
        checked={includeUhf}
        onChange={(e) => setIncludeUhf(e.target.checked)}
        style={{ marginBottom: 10 }}
      >
        Include UHF
      </Checkbox>
      <Button
        onClick={fetchData}
        type="primary"
        style={{ marginBottom: 10 }}
        loading={loading}
      >
        Fetch Data
      </Button>
      <Button
        onClick={handleDownloadExcel}
        type="default"
      >
        Download as Excel
      </Button>

      {dataType === 'all-details' && allDetails && (
        <>
          <h2>Link Details</h2>
          <Table
            dataSource={allDetails.links?.map((link, index) => ({ key: index, ...link })) || []}
            columns={[
              { title: 'Link Type', dataIndex: 'linkType', key: 'linkType' },
              { title: 'Link Text', dataIndex: 'linkText', key: 'linkText', render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} /> },
              { title: 'ARIA Label', dataIndex: 'ariaLabel', key: 'ariaLabel' },
              { title: 'URL', dataIndex: 'url', key: 'url' },
              { title: 'Redirected URL', dataIndex: 'redirectedUrl', key: 'redirectedUrl' },
              { title: 'Status Code', dataIndex: 'statusCode', key: 'statusCode', render: (text, record) => <div style={{ color: getStatusColor(record.statusCode) }}>{text}</div> },
              { title: 'Target', dataIndex: 'target', key: 'target' },
            ]}
            pagination={false}
            style={{ marginTop: 20 }}
          />
          <h2>Image Details</h2>
          <Table
            dataSource={allDetails.images?.map((image, index) => ({ key: index, ...image })) || []}
            columns={[
              { title: 'Image Name', dataIndex: 'imageName', key: 'imageName' },
              { title: 'Alt Text', dataIndex: 'alt', key: 'alt', render: (text) => <div dangerouslySetInnerHTML={{ __html: text }} /> },
            ]}
            pagination={false}
            style={{ marginTop: 20 }}
          />
          <h2>Video Details</h2>
          <Table
            dataSource={allDetails.videos?.map((video, index) => ({ key: index, ...video })) || []}
            columns={[
              { title: 'Transcript', dataIndex: 'transcript', key: 'transcript' },
              { title: 'CC', dataIndex: 'cc', key: 'cc' },
              { title: 'Autoplay', dataIndex: 'autoplay', key: 'autoplay' },
              { title: 'Muted', dataIndex: 'muted', key: 'muted' },
              { title: 'ARIA Label', dataIndex: 'ariaLabel', key: 'ariaLabel' },
              { title: 'Audio Track Present', dataIndex: 'audioTrack', key: 'audioTrack' },
            ]}
            pagination={false}
            style={{ marginTop: 20 }}
          />
          <h2>Page Properties</h2>
          <Table
            dataSource={allDetails.pageProperties?.map((meta, index) => ({ key: index, ...meta })) || []}
            columns={[
              { title: 'Name', dataIndex: 'name', key: 'name' },
              { title: 'Content', dataIndex: 'content', key: 'content' },
            ]}
            pagination={false}
            style={{ marginTop: 20 }}
          />
          <h2>Heading Hierarchy</h2>
          <Table
            dataSource={allDetails.headings?.map((heading, index) => ({ key: index, ...heading })) || []}
            columns={[
              { title: 'Level', dataIndex: 'level', key: 'level' },
              { title: 'Text', dataIndex: 'text', key: 'text' },
            ]}
            pagination={false}
            style={{ marginTop: 20 }}
          />
        </>
      )}

      {dataType !== 'all-details' && (
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
          loading={loading}
        />
      )}
    </div>
  );
};

export default App;
