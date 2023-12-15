import { Card } from "react-bootstrap";
import moment from 'moment';
import { Link } from 'react-router-dom'
import { Check, ArrowRight } from 'react-bootstrap-icons';

export default function NotificationCard({ notification, username, onStatusChange }) {

  const updateStatus = (newStatus) => {
    fetch(`${process.env.REACT_APP_API_URL}/notification/${username}/${notification.id}?mystatus=${newStatus}`, {
      method: 'PUT'
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      onStatusChange(notification.id, newStatus)
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  };

  return (
    <Card className="mb-3" key={notification.id} style={
      { maxWidth: '540px', minWidth: '300px' , backgroundColor: notification.status==="read" ? 'white' : 'lightblue' }}
      >
      <Card.Body>
        <div className="row no-gutters">
          <div className="col-md-4">
            <Card.Img variant="top" src={notification.image} />
          </div>
          <div className="col-md-8">
            <Link to={notification.link}>
            <Card.Title>{notification.type}</Card.Title>
            </Link>
            <Card.Text style={{ 
  wordWrap: 'break-word', 
  overflowWrap: 'break-word', 
  whiteSpace: 'normal', 
  overflow: 'hidden' 
}}>
              <Link to={`/UserProfile/${notification.username}`}>{notification.username}</Link> {notification.text}
            </Card.Text>
            <Card.Text>
              <small className="text-muted">{moment.utc(notification.date).fromNow()}</small>
            </Card.Text>
            {notification.status==="unread"
              ? <button title="Mark as read" onClick={() => updateStatus('read')}><Check /></button>
              : <button title="Mark as unread" onClick={() => updateStatus('unread')}><ArrowRight /></button>
            }
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
