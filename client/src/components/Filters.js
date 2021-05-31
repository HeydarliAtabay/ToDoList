import {ListGroup} from 'react-bootstrap/';

/* get the list of labels to show, the one that is selected and the handler to notify a new selection */
function Filters (props) {
  const {items, onSelection} = props;

  return (
    <ListGroup as="div" variant="flush" defaultActiveKey={props.defaultActiveKey} >
        {
          Object.entries(items).map(([key, { label }]) => {
            return (
              <ListGroup.Item as="a" key={key} action active={key === props.defaultActiveKey} onClick={() => onSelection(key)}>{label}</ListGroup.Item>
            );
          })
        }
    </ListGroup>
  )
}

export default Filters;
