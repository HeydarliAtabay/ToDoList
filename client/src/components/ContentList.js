
import dayjs from 'dayjs';
import isYesterday from 'dayjs/plugin/isYesterday';
import isTomorrow from 'dayjs/plugin/isTomorrow';
import isToday from 'dayjs/plugin/isToday';

import { Form, ListGroup, Button, Col, Row } from 'react-bootstrap/';
import { PersonSquare, PencilSquare, Trash } from 'react-bootstrap-icons';

dayjs.extend(isYesterday).extend(isToday).extend(isTomorrow);


function formatDeadline (date) {
  if (!date) return '--o--';
  else if (dayjs(date).isToday()) {
    return dayjs(date).format('[Today at] HH:mm');
  } else if (dayjs(date).isTomorrow()) {
    return dayjs(date).format('[Tomorrow at] HH:mm');
  } else if (dayjs(date).isYesterday()) {
    return dayjs(date).format('[Yesterday at] HH:mm');
  } else {
    return dayjs(date).format('dddd DD MMMM YYYY [at] HH:mm');
  }
}

function TaskRowData(props) {
  const { task } = props;

  return (
    <>
    <Col sm={4}>
      <div className="flex-fill m-auto">
        <Form.Group className="m-0" controlId="formBasicCheckbox">
          <Form.Check type="checkbox" label={task.description} className={task.important ? 'important' : ''} />
        </Form.Group></div>
        </Col>

      <Col sm={1}><div className="flex-fill mx-2 m-auto"><PersonSquare className={task.private ? 'invisible' : ''} /></div></Col>
      <Col sm={4}><div className="flex-fill m-auto"><small>{(formatDeadline(task.deadline))}</small></div></Col>
      
    </>
  )
}

function TaskRowControl (props) {
  const { onDelete, onEdit } = props;
  return (
    <>
    <Col sm={2}>
      <div className="flex-fill m-auto">
        <Button variant="link" className="shadow-none" onClick={onEdit}><PencilSquare /></Button>
        <Button variant="link" className="shadow-none" onClick={onDelete}><Trash /></Button>
      </div>
      </Col>
    </>
  )
}


function ContentList (props) {
  const { tasks, onDelete, onEdit } = props;

  return (
    <>

      <ListGroup as="ul" variant="flush">
        {
          tasks.map(t => {
            return (
              <ListGroup.Item as="li" key={t.id} className="d-flex w-100 justify-content-between">
                  <TaskRowData task={t} />
                  <TaskRowControl task={t} onDelete={() => onDelete(t)} onEdit={() => onEdit(t)} />
              </ListGroup.Item>
            );
          })
        }
      </ListGroup>
      
    </>
  )
}

export default ContentList;