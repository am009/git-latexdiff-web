"use client";
import { UploadOutlined } from '@ant-design/icons';
import Text from "antd/es/typography/Text";
import Title from "antd/es/typography/Title";
import Button from 'antd/es/button/button';
import Upload from 'antd/es/upload/Upload';
import Input from 'antd/es/input/Input';
import Space from 'antd/es/space';
import Select from 'antd/es/select';
import ColorPicker from 'antd/es/color-picker/ColorPicker';
import Giscus from './giscus';
import Checkbox from 'antd/es/checkbox/Checkbox';
import { useState } from 'react';
import { Form } from 'antd';

export default function Home() {

  return (
    <div>
      <Title><a href="https://github.com/am009/git-latexdiff-web">git-latexdiff web</a></Title>
      <Text strong>An online tool for <a target="_blank" href="https://github.com/ftilmann/latexdiff">latexdiff</a> and <a target="_blank" href="https://gitlab.com/git-latexdiff/git-latexdiff">git-latexdiff</a>.</Text>
      <br />
      Old version of zip project downloaded from Overleaf:
      <Upload maxCount={1}>
        <Button icon={<UploadOutlined />}>Select New Latex zip project</Button>
      </Upload>
      New version of zip project downloaded from Overleaf:
      <Upload maxCount={1}>
        <Button icon={<UploadOutlined />}>Select Old Latex zip project</Button>
      </Upload>
      Main tex filename:
      <Input placeholder="main.tex" />
      Other git-latexdiff options:
      <Input defaultValue="--latexopt -shell-escape --ignore-latex-errors" />

      Diff text style:
      <Select
        defaultValue="custom"
        style={{ width: 120 }}
        // onChange={handleChange}
        options={[
          { value: 'custom', label: 'Custom' },
          { value: 'UNDERLINE', label: 'UNDERLINE' },
          { value: 'CTRADITIONAL', label: 'CTRADITIONAL' },
          { value: 'TRADITIONAL', label: 'TRADITIONAL' },
          { value: 'CFONT', label: 'CFONT' },
          { value: 'FONTSTRIKE', label: 'FONTSTRIKE' },
          { value: 'INVISIBLE', label: 'INVISIBLE' },
          { value: 'CHANGEBAR', label: 'CHANGEBAR' },
          { value: 'CCHANGEBAR', label: 'CCHANGEBAR' },
          { value: 'CULINECHBAR', label: 'CULINECHBAR' },
          { value: 'CFONTCHBAR', label: 'CFONTCHBAR' },
          { value: 'BOLD', label: 'BOLD' },
          { value: 'PDFCOMMENT', label: 'PDFCOMMENT' },
        ]}
      />

      <br />
      <Space id="new-text-style">
        <Checkbox defaultChecked>Show new text</Checkbox>
        <Checkbox defaultChecked>Change Color</Checkbox>
        <ColorPicker allowClear disabledAlpha defaultValue="#0000ff" showText />
        Text style:
        <Select
          defaultValue="none"
          style={{ width: 120 }}
          options={[
            { value: 'none', label: 'none' },
            { value: 'underline_wave', label: 'underline_wave' },
            { value: 'strikeout', label: 'strikeout' },
          ]}
        />
      </Space>
      <br />
      <Space id="old-text-style">
        <Form disabled>
        <Checkbox defaultChecked>Show removed text</Checkbox>
        <Checkbox defaultChecked>Change Color</Checkbox>
        <ColorPicker allowClear disabledAlpha defaultValue="#ff0000" showText />
        Text style:
        <Select
          defaultValue="strikeout"
          style={{ width: 120 }}
          options={[
            { value: 'none', label: 'none' },
            { value: 'underline_wave', label: 'underline_wave' },
            { value: 'strikeout', label: 'strikeout' },
          ]}
        />
        </Form>
       
      </Space>
      <Button>Submit</Button>
      <Giscus
        id="comments"
        repo="am009/git-latexdiff-web"
        repoId="R_kgDOKDZDvQ"
        category="Giscus"
        categoryId="DIC_kwDOKDZDvc4CfHLj"
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="preferred_color_scheme"
        lang="en" />
    </div>
  );
}
