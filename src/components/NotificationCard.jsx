import { Card } from "react-bootstrap";
import moment from 'moment';
import { Link } from 'react-router-dom'
import { Check } from 'react-bootstrap-icons';

export default function NotificationCard({ notification }) {
  return (
    <Card className="mb-3" key={notification.id} style={{ maxWidth: '540px' }}>
      <Card.Body>
        <div className="row no-gutters">
          <div className="col-md-4">
            <Card.Img variant="top" src={notification.image} />
          </div>
          <div className="col-md-8">
            <Card.Title>Card title</Card.Title>
            <Card.Text>
              <Link to={`/users/${notification.username}`}>{notification.username}</Link> ha fet {notification.text}
            </Card.Text>
            <Card.Text>
              <small className="text-muted">{moment.utc(notification.date).fromNow()}</small>
            </Card.Text>
            <button onClick={() => alert("Hello")}><Check /></button>
          </div>
        </div>
      </Card.Body>
    </Card>
  )
}
