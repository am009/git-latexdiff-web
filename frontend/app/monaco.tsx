import * as monaco from "monaco-editor/esm/vs/editor/editor.api";

import { useEffect, useRef } from "react";

export type ChangeHandler = (
  value: string,
  event: monaco.editor.IModelContentChangedEvent,
) => void;

export interface MonacoDiffEditorProps {
  /**
   * The original value to compare against.
   */
  original?: string;

  /**
   * Value of the auto created model in the editor.
   * If you specify value property, the component behaves in controlled mode. Otherwise, it behaves in uncontrolled mode.
   */
  modified?: string;

  /**
   * Refer to Monaco interface {monaco.editor.IDiffEditorConstructionOptions}.
   */
  options?: monaco.editor.IDiffEditorConstructionOptions;

  /**
   * An event emitted when the content of the current model has changed.
   */
  onOldChange?: ChangeHandler;
  onNewChange?: ChangeHandler;
}

export default function MonacoDiffEditor(
  {
    original,
    modified,
    options,
    onOldChange,
    onNewChange,
  }: MonacoDiffEditorProps
) {
  const containerElement = useRef<HTMLDivElement | null>(null);
  const editor = useRef<monaco.editor.IStandaloneDiffEditor | null>(null);
  const _oldSubscription = useRef<monaco.IDisposable | undefined>(undefined);
  const _newSubscription = useRef<monaco.IDisposable | undefined>(undefined);
  const originalModel = useRef<monaco.editor.ITextModel | null>(null);
  const modifiedModel = useRef<monaco.editor.ITextModel | null>(null);

  useEffect(
    () => {
      if (containerElement.current) {
        if (editor.current !== null) {
          console.log("Error! editor object is not null! Skip initialization.");
          return
        } else {
          editor.current = monaco.editor.createDiffEditor(
            containerElement.current,
            options
          );
        }
        const originalText = original === undefined ? "" : original;
        if (originalModel.current === null) {
          originalModel.current = monaco.editor.createModel(
            originalText
          );
        } else {
          originalModel.current.setValue(originalText);
        }
        
        const modifiedText = modified === undefined ? "" : modified;
        if (modifiedModel.current === null) {
          modifiedModel.current = monaco.editor.createModel(
            modifiedText
          );
        } else {
          modifiedModel.current.setValue(modifiedText);
        }

        editor.current.setModel({
          original: originalModel.current,
          modified: modifiedModel.current,
        });

        // TODO: handle onOldChange and onNewChange change.
        if (onOldChange !== undefined && _oldSubscription.current === undefined) {
          const models = editor.current.getModel()
          _oldSubscription.current = models?.original.onDidChangeContent((event) => {
            onOldChange(models?.original.getValue(), event)
          });
        }
        if (onNewChange !== undefined && _newSubscription.current === undefined) {
          const models = editor.current.getModel()
          _newSubscription.current = models?.modified.onDidChangeContent((event) => {
            onNewChange(models?.modified.getValue(), event)
          });
        }
        return;
      }
    },
    [onOldChange, onNewChange, options, original, modified],
  );

  return (
    <div
      ref={ containerElement }
      style={{ height: "75vh" }}
      className="react-monaco-editor-container"
    />
  );
}