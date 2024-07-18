import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Layout, Row, Tree, message, Upload } from "antd";
import { UploadOutlined, DownOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';
import {
  gzip, zlib, AsyncGzip, zip, unzip, strFromU8,
  Zip, AsyncZipDeflate, Unzip, AsyncUnzipInflate,
  Unzipped
} from 'fflate';
import { useState, useEffect } from 'react';
import { InboxOutlined } from '@ant-design/icons';
import type { DiffChangeHandler } from 'react-monaco-editor';
import type { UploadProps } from 'antd';
import Text from "antd/es/typography/Text";

const { Header, Footer, Sider, Content } = Layout;
const { Dragger } = Upload;

import dynamic from "next/dynamic";
const MonacoDiffEditor = dynamic(() => import("react-monaco-editor/lib/diff"), {
  ssr: false,
});

export default function DiffEditor() {
  const [oldProjectFilename, setOldProjectFilename] = useState("")
  const [newProjectFilename, setNewProjectFilename] = useState("")
  const [oldTreeData, setOldTreeData] = useState<Unzipped | null>(null)
  const [newTreeData, setNewTreeData] = useState<Unzipped | null>(null)
  const onOldChange: DiffChangeHandler = (value, event) => {
    console.log(value, event);
  }
  const makeOrGetDir = (children: TreeDataNode[], key: string, name: string) => {
    const node = children.find((child) => child.title === name)
    if (node) {
      return node
    }
    const newNode: TreeDataNode = {
      title: name,
      key: `${key}/${name}`,
      children: []
    }
    children?.push(newNode)
    return newNode
  }
  const convertZipToTree = (zip: Unzipped | null, other: Unzipped | null) => {
    let root: TreeDataNode[] = []
    if (zip === null) {
      return root
    }
    for (const path in zip) {
      const dirs = path.split('/')
      let current = root
      let currentKey = ''
      for (let i = 0; i < dirs.length - 1; i++) {
        const t = makeOrGetDir(current, currentKey.toString(), dirs[i])
        if (t.children === undefined) {
          message.error(`Folder and file name collision: ${t.key}.`)
          t.children = []
        }
        currentKey = t.key as string
        current = t.children as TreeDataNode[]
      }
      const leaf: TreeDataNode = {
        title: dirs[dirs.length - 1],
        key: path,
        disabled: other !== null && other[path] === undefined
      }
      current.push(leaf)
    }
    return root
  }
  const uploadPropsOld: UploadProps = {
    onChange(info) {
      message.info(`Processing: ${info.file.name}`, 1.5);
      setOldProjectFilename(info.file.name);
      info.fileList[0].originFileObj?.arrayBuffer().then((buffer) => {
        unzip(new Uint8Array(buffer), (err, unzipped) => {
          if (err) { message.error(`Unzip file ${info.file.name} failed.`); }
          console.log(unzipped);
          setOldTreeData(unzipped);
        });
      }).catch((err) => {
        message.error(`Read file ${info.file.name} failed.`);
      });
    }
  }
  const uploadPropsNew: UploadProps = {
    onChange(info) {
      message.success(`${info.file.name}`);
      setNewProjectFilename(info.file.name);
      info.fileList[0].originFileObj?.arrayBuffer().then((buffer) => {
        unzip(new Uint8Array(buffer), (err, unzipped) => {
          if (err) {
            message.error(`Unzip file ${info.file.name} failed.`);
          } else {
            console.log(unzipped);
            setNewTreeData(unzipped);
          }
        });
      }).catch((err) => {
        message.error(`Read file ${info.file.name} failed.`);
      });
    }
  }

  const onSelectOld: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const onSelectNew: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
  };
  const code1 = "// your original code...";
  const code2 = "// a different version...";
  const options = {
    renderSideBySide: true,
    automaticLayout: true,
    originalEditable: true
  };

  const commonProps: UploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    accept: 'zip,application/zip,application/x-zip,application/x-zip-compressed',
    multiple: false,
  };

  const UploadWindow = () => (<>
    <Row>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Dragger {...commonProps} {...uploadPropsOld}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
      </Col>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Dragger {...commonProps} {...uploadPropsNew}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single or bulk upload. Strictly prohibited from uploading company data or other
            banned files.
          </p>
        </Dragger>
      </Col>
    </Row>
  </>)

  const DiffWindow = () => (<>
    <Layout>
      <Sider width="15%" collapsible={true} theme="light" collapsedWidth={0}>
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelectOld}
          treeData={convertZipToTree(oldTreeData, newTreeData)}
        />
      </Sider>
      <Content>
        <MonacoDiffEditor
          original={code1}
          value={code2}
          options={options}
          onChange={onOldChange}
        // height={'70vh'}
        />
      </Content>
      <Sider width="15%" reverseArrow={true} collapsible={true} theme="light" collapsedWidth={0}>
        <Tree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelectNew}
          treeData={convertZipToTree(newTreeData, oldTreeData)}
        />
      </Sider>
    </Layout>
    <Row>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button icon={<DownloadOutlined />} download="todo.zip">
          Save as ZIP
        </Button>
      </Col>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button icon={<DownloadOutlined />} download="todo.zip">
          Save as ZIP
        </Button>

      </Col>
    </Row>
  </>)

  return (<>
    <Row>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Text style={{ fontSize: "12pt" }}>Old Project</Text>
      </Col>
      <Col span={12} style={{ display: 'flex', justifyContent: 'center' }}>
        <Text style={{ fontSize: "12pt" }}>New Project</Text>
      </Col>
    </Row>
    {/* {oldProjectFilename.length > 0 && oldProjectFilename.length > 0 ? <DiffWindow /> : <UploadWindow />} */}
    <DiffWindow />
    <br />
    <UploadWindow />
  </>);
}
