import { DownloadOutlined } from '@ant-design/icons';
import { Button, Col, Layout, Row, Tree, message, Upload, Divider } from "antd";
import { UploadOutlined, DownOutlined } from '@ant-design/icons';
import type { TreeDataNode, TreeProps } from 'antd';
import {
  gzip, zlib, AsyncGzip, zip, unzip, strFromU8,
  Zip, AsyncZipDeflate, Unzip, AsyncUnzipInflate,
  Unzipped
} from 'fflate';
import { useState, useEffect, Key } from 'react';
import { InboxOutlined, CheckOutlined, UndoOutlined } from '@ant-design/icons';
import type { ChangeHandler, MonacoDiffEditorProps } from './monaco';
import type { UploadProps } from 'antd';
import Text from "antd/es/typography/Text";
import { saveAs } from 'file-saver';
const { DirectoryTree } = Tree;


// import MonacoDiffEditor from './monaco';
import dynamic from "next/dynamic";
const MonacoDiffEditor = dynamic(() => import("./monaco"), {
  ssr: false,
});

const { Header, Footer, Sider, Content } = Layout;
const { Dragger } = Upload;

export default function DiffEditor() {
  const [oldProjectFilename, setOldProjectFilename] = useState("")
  const [newProjectFilename, setNewProjectFilename] = useState("")
  const [oldTreeData, setOldTreeData] = useState<Unzipped | null>(null)
  const [newTreeData, setNewTreeData] = useState<Unzipped | null>(null)
  const [selectedKey, setSelectedKey] = useState('')
  const [expandedKeysOld, setExpandedKeysOld] = useState<Key[]>([])
  const [expandedKeysNew, setExpandedKeysNew] = useState<Key[]>([])

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
        if (dirs[i].length === 0) { continue }
        const t = makeOrGetDir(current, currentKey.toString(), dirs[i])
        if (t.children === undefined) {
          message.error(`Folder and file name collision: ${t.key}.`)
          t.children = []
        }
        currentKey = t.key as string
        current = t.children as TreeDataNode[]
      }
      if (dirs.length === 0 || dirs[dirs.length-1].length === 0) { continue }
      const leaf: TreeDataNode = {
        title: dirs[dirs.length - 1],
        key: path,
        disabled: other !== null && other[path] === undefined,
        isLeaf: true,
      }
      current.push(leaf)
    }
    return root
  }
  const uploadPropsOld: UploadProps = {
    onChange(info) {
      message.info(`Processing: ${info.file.name}`, 1.5);
      info.fileList[0].originFileObj?.arrayBuffer().then((buffer) => {
        unzip(new Uint8Array(buffer), (err, unzipped) => {
          if (err) {
            message.error(`Unzip file ${info.file.name} failed.`)
          } else {
            // console.log(unzipped);
            setOldProjectFilename(info.file.name)
            setOldTreeData(unzipped);
          }
        });
      }).catch((err) => {
        message.error(`Read file ${info.file.name} failed.`)
      });
    }
  }
  const uploadPropsNew: UploadProps = {
    onChange(info) {
      message.success(`${info.file.name}`);
      info.fileList[0].originFileObj?.arrayBuffer().then((buffer) => {
        unzip(new Uint8Array(buffer), (err, unzipped) => {
          if (err) {
            message.error(`Unzip file ${info.file.name} failed.`);
          } else {
            // console.log(unzipped)
            setNewProjectFilename(info.file.name)
            setNewTreeData(unzipped)
          }
        });
      }).catch((err) => {
        message.error(`Read file ${info.file.name} failed.`);
      });
    }
  }

  const onSelectTree: TreeProps['onSelect'] = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    if (selectedKeys.length === 0) {
      setSelectedKey('')
    } else {
      setSelectedKey(selectedKeys[0] as string)
    }
  }
  const hasFileData = (zip: Unzipped | null, key: string) => { return zip !== null && key.length > 0 && zip[key] !== undefined }
  const getTreeData = (zip: Unzipped | null, key: string) => { return hasFileData(zip, key) ? new TextDecoder().decode((zip as Unzipped)[key]) : '' }
  const original = getTreeData(oldTreeData, selectedKey)
  const modified = getTreeData(newTreeData, selectedKey)
  const onOldChange: ChangeHandler = (value, event) => {
    if (hasFileData(oldTreeData, selectedKey)) {
      (oldTreeData as Unzipped)[selectedKey] = new TextEncoder().encode(value)
    }
  }
  const onNewChange: ChangeHandler = (value, event) => {
    if (hasFileData(newTreeData, selectedKey)) {
      (newTreeData as Unzipped)[selectedKey] = new TextEncoder().encode(value)
    }
  }
  const downloadZip = (zipFile: Unzipped | null, filename: string) => {
    if (zipFile === null) { return }
    zip(zipFile, {
      // The options object is still optional, you can still do just
      // zip(archive, callback)
      level: 0
    }, (err, data) => {
      if (err) {
        message.error(`Create zip file failed.`);
      } else {
        const blob = new Blob([data], { type: 'application/zip' })
        // window.open(URL.createObjectURL(blob), '_blank');
        saveAs(blob, filename, { autoBom: false })
      }
    })
  }
  const options = {
    renderSideBySide: true,
    automaticLayout: true,
    originalEditable: true
  }

  const commonProps: UploadProps = {
    beforeUpload: () => false,
    maxCount: 1,
    accept: 'zip,application/zip,application/x-zip,application/x-zip-compressed',
    multiple: false,
  }

  const UploadWindow = () => (<>
    <Row>
      <Col span={12}>
        <Dragger {...commonProps} {...uploadPropsOld}>
          <p className="ant-upload-drag-icon">
            {oldTreeData === null ? <InboxOutlined /> : <CheckOutlined />}
          </p>
          <p className="ant-upload-text">Old Project</p>
          <p className="ant-upload-hint">
            Click or drag file to this area to upload. <br />
            Support zip latex project. You can download from overleaf.
          </p>
        </Dragger>
      </Col>
      <Col span={12}>
        <Dragger {...commonProps} {...uploadPropsNew}>
          <p className="ant-upload-drag-icon">
            {newTreeData === null ? <InboxOutlined /> : <CheckOutlined />}
          </p>
          <p className="ant-upload-text">New Project</p>
          <p className="ant-upload-hint">
            Click or drag file to this area to upload. <br />
            Support zip latex project. You can download from overleaf.
          </p>
        </Dragger>
      </Col>
    </Row>
  </>)

  const DiffWindow = () => (<>
    <Layout>
      <Sider width="15%" collapsible={true} theme="light" collapsedWidth={0}>
        <DirectoryTree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelectTree}
          treeData={convertZipToTree(oldTreeData, newTreeData)}
          expandedKeys={expandedKeysOld}
          onExpand={(expandedKeys) => setExpandedKeysOld(expandedKeys)}
        />
      </Sider>
      <Content>
        <MonacoDiffEditor
          original={original}
          modified={modified}
          options={options}
          onOldChange={onOldChange}
          onNewChange={onNewChange}
        // height={'70vh'}
        />
      </Content>
      <Sider width="15%" reverseArrow={true} collapsible={true} theme="light" collapsedWidth={0}>
        <DirectoryTree
          showLine
          switcherIcon={<DownOutlined />}
          defaultExpandedKeys={['0-0-0']}
          onSelect={onSelectTree}
          treeData={convertZipToTree(newTreeData, oldTreeData)}
          expandedKeys={expandedKeysNew}
          onExpand={(expandedKeys) => setExpandedKeysNew(expandedKeys)}
        />
      </Sider>
    </Layout>
    <Row style={{marginTop: "5px"}}>
      <Col span={11} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button icon={<DownloadOutlined />} onClick={() => { downloadZip(oldTreeData, oldProjectFilename) }}>
          Save
        </Button>
      </Col>
      <Col span={2}>
        <Button icon={<UndoOutlined />} onClick={() => {setNewTreeData(null); setNewProjectFilename(''); setOldTreeData(null); setOldProjectFilename(''); setSelectedKey('')}}>Reset</Button>
      </Col>
      <Col span={11} style={{ display: 'flex', justifyContent: 'center' }}>
        <Button icon={<DownloadOutlined />} onClick={() => { downloadZip(newTreeData, newProjectFilename) }}>
          Save
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
    <Divider style={{ margin: "5px 0 10px 0" }} />
    {oldTreeData !== null && newTreeData !== null ? <DiffWindow /> : <UploadWindow />}
    {/* <DiffWindow /> <br /> <UploadWindow /> */}
  </>);
}
