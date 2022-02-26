import * as React from "react";
import { parseCsvData, parseExcelData, parseMarkdownTable, sanitize, toMarkdown } from "../utils/markdown";
import Cell from "./Cell";

type Props = {
  data: string,
  updateViewData: (data: string) => void
}

export const TableEditor = (props: Props) => {
  const [newRows, setNewRows] = React.useState(3);
  const [newCols, setNewCols] = React.useState(3);
  const [values, setValues] = React.useState(Array(2).fill(['']));
  const [copyText, setCopyText] = React.useState('Copy as Markdown');

  const onContentChanged = (rowIndex: number, colIndex: number, value: string) => {
    const newValues = [...values];
    newValues[rowIndex][colIndex] = value;
    props.updateViewData(toMarkdown(newValues));
    setValues(newValues);
  }

  React.useEffect(() => {
    let data = parseMarkdownTable(props.data) || parseCsvData(props.data) || parseExcelData(props.data) || Array(2).fill(['']);
    data = sanitize(data);
    setValues(data);
  }, [props.data]);

  React.useEffect(() => {
    if (copyText !== 'Copy as Markdown') {
      setCopyText('Copy as Markdown');
    }
  }, [values]);

  const copyClicked = () => {
    setCopyText('Copied!');
    navigator?.clipboard?.writeText(toMarkdown(values));
  }

  const newTableClicked = () => {
    const newValues = Array(newRows).fill([]).map(row => Array(newCols).fill(''));
    setValues(newValues);
  }

  const clearClicked = () => {
    setValues(Array(2).fill(['']));
  }

  return (
    <>
      <div className='mte button-container'>
        Rows : <input type='text' onChange={e => setNewRows(parseInt(e.target.value))} placeholder='3'/>
        Columns : <input type='text' onChange={e => setNewCols(parseInt(e.target.value))} placeholder='3' />
        <button onClick={newTableClicked}>New Table</button>
        <button onClick={clearClicked}>Clear Table</button>
      </div>
      <div className='mte button-container'>
        <button onClick={copyClicked}>{copyText}</button>
        {/* <svg viewBox="0 0 100 100" className="checkbox-glyph" width="18" height="18"><path fill="currentColor" stroke="currentColor" d="M89.9,20c-0.9,0-1.7,0.4-2.3,1l-51,51l-21-21c-0.8-0.9-2.1-1.2-3.2-0.9s-2.1,1.2-2.4,2.4c-0.3,1.2,0,2.4,0.9,3.2L34.3,79 c1.3,1.3,3.4,1.3,4.7,0l53.3-53.3c1-1,1.3-2.4,0.7-3.7C92.6,20.7,91.3,19.9,89.9,20z"></path></svg> */}
      </div>
      <div className="mte grid" style={{
        gridTemplateColumns: `repeat(${values[0]?.length}, 1fr)`
      }}>
        {
          values.map((row, rowIdx) => 
            row.map((value: string, colIdx: number) => 
              <Cell key={`${rowIdx}-${colIdx}`} content={value} row={rowIdx} col={colIdx} values={values} setValues={setValues} onContentChanged={onContentChanged} />))
          .flat()
        }
      </div>
      <div className='mte button-container'>
        <button onClick={copyClicked}>{copyText}</button>
      </div>
    </>
  );
};