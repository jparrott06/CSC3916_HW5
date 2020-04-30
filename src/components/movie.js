import React, { Component }  from 'react';
import {connect} from "react-redux";
import {
    Glyphicon,
    Panel,
    ListGroup,
    ListGroupItem,
    Form,
    FormGroup,
    Col,
    ControlLabel,
    FormControl, Button
} from 'react-bootstrap'
import { Image } from 'react-bootstrap'
import { withRouter } from "react-router-dom";
import {fetchMovie} from "../actions/movieActions";
import {submitForm} from "../actions/movieActions";

//support routing by creating a new component

class Movie extends Component {

    constructor(props) { //our constructor to initialize description, rating to ''
        super(props);

        this.updateDetails = this.updateDetails.bind(this); //*Must* bind state to these functions.
        this.submitReview = this.submitReview.bind(this); //will be calling them below to make a new review.

        this.state = {
            details:{
                description: '',
                rating: ''
            }
        };
    }

    componentDidMount() {

        const {dispatch} = this.props; //checks if component mounted.

        if (this.props.selectedMovie == null) { //if null, fetchMovie is called with movieId properties
            dispatch(fetchMovie(this.props.movieId));
        }

    }

    updateDetails(event){ //inspired by register.js's updateDetails
        let updateDetails = Object.assign({}, this.state.details);

        updateDetails[event.target.id] = event.target.value;
        this.setState({ //use setState instead of changing directly.
            details: updateDetails
        });
    }

    submitReview() { //used in our button below to submit the user's new review
        const {dispatch} = this.props; //inspired by login.js's login()

        let details = { //setting the key-value pairs needed for review to the input user types in

            movieid : this.props.match.params.movieId,
            description: this.state.details.description,
            rating: this.state.details.rating

        };

        dispatch(submitForm(details)); //dispatch submitForm with details as argument.
    }

    render() {
        const ActorInfo = ({actors}) => {
            return actors.map((actor, i) =>
                <p key={i}>
                    <b>{actor.actorName}</b> {actor.characterName}
                </p>
            )
        }

        const ReviewInfo = ({reviews}) => {
            return reviews.map((review, i) =>
                <p key={i}>
                    <b>{review.reviewer}</b> {review.description + " "}
                    <Glyphicon glyph={'star'} /> {review.rating}
                </p>
            )
        }

        const DetailInfo = ({currentMovie}) => {
            if (!currentMovie) { //if not could still be fetching the movie
                return <div>Loading...</div>;
            }
            return (
              <Panel>
                  <Panel.Heading>Movie Detail</Panel.Heading>
                  <Panel.Body><Image className="image" src={currentMovie.imageUrl} thumbnail /></Panel.Body>
                  <ListGroup>
                      <ListGroupItem>{currentMovie.title}</ListGroupItem>
                      <ListGroupItem><ActorInfo actors={currentMovie.actors} /></ListGroupItem>
                      <ListGroupItem><h4><Glyphicon glyph={'star'}/> {currentMovie.ratingAvg} </h4></ListGroupItem>
                  </ListGroup>
                  <Panel.Body><ReviewInfo reviews={currentMovie.reviews} /></Panel.Body>


              </Panel>
            );
        }

        return ( //rendering inspired by login.js's FormGroups and FormControl. Set value domain for rating to be 1-5.
            <div>
            <DetailInfo currentMovie={this.props.selectedMovie} />

                <Form horizontal> <h5>What did <i><b>you</b></i> think of this film? Leave a Review!</h5>
                    <FormGroup controlId="description">
                        <Col componentClass={ControlLabel} sm={2}>
                            Review
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.description} type="text" placeholder="description" />
                        </Col>
                    </FormGroup>
                    <FormGroup controlId="rating">
                        <Col componentClass={ControlLabel} sm={2}>
                            Rating
                        </Col>
                        <Col sm={10}>
                            <FormControl onChange={this.updateDetails} value={this.state.details.rating} type="number" min="1" max="5" />
                        </Col>
                    </FormGroup>
                    <FormGroup>
                        <Col smOffset={2} sm={10}>
                            <Button bsStyle = "primary" onClick={this.submitReview}>Submit</Button>
                        </Col>
                    </FormGroup>
                </Form>

            </div>

        )
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log(ownProps);
    return {
        selectedMovie: state.movie.selectedMovie,
        movieId: ownProps.match.params.movieId
    }
}

export default withRouter(connect(mapStateToProps)(Movie));