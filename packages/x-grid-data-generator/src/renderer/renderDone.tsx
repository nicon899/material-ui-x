import * as React from 'react';
import DoneIcon from '@material-ui/icons/Done';
import ClearIcon from '@material-ui/icons/Clear';
import { CellParams } from '@material-ui/x-grid';

interface IsDoneProps {
  value: boolean;
}

const IsDone = React.memo(function IsDone(props: IsDoneProps) {
  return props.value ? <DoneIcon fontSize="small" /> : <ClearIcon fontSize="small" />;
});

export function renderDone(params: CellParams) {
  return <IsDone value={!!params.value} />;
}
