import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Row, Toast } from 'react-bootstrap';
import axios from 'axios';


const FormMessage = () => {
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [comments, setComments] = useState([]); 

    const handleSendMessage = () => {
        const newMessage = {
            username: name,
            message: message,
        };

        axios.post('https://wedding-db-json-production.up.railway.app/comments', newMessage)
            .then(response => {
                console.log('Message sent successfully:', response.data);
                // Show success toast
                setShowSuccessToast(true);
                fetchComments();
                setName('');
                setMessage('');
                // Additional handling if needed, e.g., update state
            })
            .catch(error => {
                console.error('Error sending message:', error);
                // Show error toast
                setShowErrorToast(true);
                // Additional error handling if needed, e.g., update state
            });
    };

    const fetchComments = async () => {
        try {
            const response = await axios.get('https://wedding-db-json-production.up.railway.app/comments');
            setComments(response.data);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setShowErrorToast(true);
        }
    };

    useEffect(() => {
        fetchComments();
    }, []);
    
    return(
        <React.Fragment>
            <div className="container bg-primary pb-5">
                <div className="message-scroll pb-5">
                    <Row className="gy-3">
                        {comments.map((comment) => (
                            <Col xs={12} key={comment.id}>
                                <div className="d-flex">
                                    <div className="avatar-item col-3 text-capitalize">{comment.username ? comment.username.trim().charAt(0) : ''}</div>
                                    <Card className="message-head text-left col px-2 pb-2">
                                        <div className="message-arrow"></div>
                                        <Card.Title className="message-username m-0 mt-2 ps-1">{comment.username}</Card.Title>
                                        <Card.Body className="p-1">
                                            <Card.Text className="message-body p-0">
                                                {comment.message}
                                            </Card.Text>
                                        </Card.Body>
                                    </Card>
                                </div>
                            </Col>
                        ))}
                    </Row>
                </div>
                <div className="form-container mt-2 px-4">
                    <label>Kirim Ucapan</label>
                    <Row className="gy-3">
                        <Col xs={12}>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="nama anda"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </Col>
                        <Col xs={12}>
                            <textarea
                                className="form-control"
                                placeholder="Tulis pesan Anda..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            ></textarea>
                        </Col>
                        <Col xs={12}>
                            <Button
                                variant="success"
                                className="w-100"
                                onClick={handleSendMessage}
                            >
                                Kirim
                            </Button>
                        </Col>
                    </Row>

                </div>
            </div>
            {/* Success Toast */}
            <Toast
                show={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    top: '10vh',
                    right: 16,
                }}
            >
                <Toast.Header closeButton={false} className="bg-success text-white">
                    <strong className="mx-auto">Yeay!</strong>
                </Toast.Header>
                <Toast.Body>Ucapanmu sudah dikirim.</Toast.Body>
            </Toast>

            {/* Error Toast */}
            <Toast
                show={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                delay={3000}
                autohide
                style={{
                    position: 'fixed',
                    bottom: 16,
                    right: 16,
                }}
            >
                <Toast.Header closeButton={false} className="bg-danger text-white">
                    <strong className="me-auto">Error!</strong>
                </Toast.Header>
                <Toast.Body>Error sending message. Please try again.</Toast.Body>
            </Toast>

        </React.Fragment>
    )
}

export default FormMessage;