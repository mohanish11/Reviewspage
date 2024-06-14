import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
library.add(faStar, faStarHalfAlt);
function ReviewList() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetch('reviewsData.json')
      .then(res => res.json())
      .then(data => setReviews(data));
  }, []);

  return (
    <div className="review-list">
      {reviews.map((review, index) => (
        <Review key={index} review={review} />
      ))}
    </div>
  );
}
function Rating(rating){
  const stars=[];
  for(let i=0;i<5;i++){
      if (i < Math.floor(rating/2)) {
          stars.push(<FontAwesomeIcon key={`${i}-${rating}`}  icon="star" className="A" />);
        } else if (i < Math.floor((rating/2)) + 0.5) {
          stars.push(<FontAwesomeIcon key={`${i}-${rating}`} icon="star-half-alt" className="B" />);
        } else {
          stars.push(<FontAwesomeIcon key={`${i}-${rating}`} icon="star" className="C" />);
        }
  }
  return(
      <div className="rating">{stars}</div>
  )
 }
 function Review({ review }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [hoveredSentenceIndex, setHoveredSentenceIndex] = useState(null);
  const handleMouseOver = (sentenceIndex) => {
    setHoveredSentenceIndex(sentenceIndex);
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const highlightSentences = (analytics) => {
    const highlightedSentences = [];
    for (const { topic, sentiment, highlight_indices } of analytics) {
      if (highlight_indices && highlight_indices.length > 0) {
        highlight_indices.forEach((index) => {
          highlightedSentences.push({
            topic,
            sentiment,
            startIndex: index[0],
            endIndex: index[1],
          });
        });
      }
    }
    highlightedSentences.sort((a, b) => a.startIndex - b.startIndex);
    return highlightedSentences;
  };

  const highlightedSentences = highlightSentences(review.analytics);
  const renderReviewText = () => {
    const text = review.content.split('');
    return text.map((char, index) => {
    for (let i = 0; i < highlightedSentences.length; i++) {
     const sentence = highlightedSentences[i];
     if (index >= sentence.startIndex && index <=sentence.endIndex) {
     return (
          <span
             key={index}
             className={`highlighted-sentence${sentence.sentiment}`}
             onMouseOver={() => handleMouseOver(i)}
             onMouseLeave={handleMouseLeave}>
            {showTooltip && hoveredSentenceIndex === i &&(
              <div className="tooltip">
                <p>{sentence.topic}</p>
                </div>)
                }
            {char}
          </span>);
          }
        }
        return <span key={index}>{char}</span>;
      });
     };
  return (
    <div
      className="review"
    >
      <div className="review-header">
        <img src="https://logowik.com/content/uploads/images/trip-advisor-icon4470.jpg" className="profile-pic" alt="" />
        <div className="reviewer-name">{review.reviewer_name}</div>
        <p>wrote a review at</p>
        <div className="review-source-name">{review.source.name}</div>
        <p>&nbsp;on</p>
        <div className="review-date">{review.date}</div>
        <div className="symbols">
          <img src="https://cdn.hugeicons.com/icons/user-add-01-stroke-rounded.svg" alt="user-add-01" height="20" />&nbsp;
          <img src="https://cdn.hugeicons.com/icons/bookmark-02-stroke-rounded.svg" alt="bookmark-02" height="20" />&nbsp;
          <img src="https://cdn.hugeicons.com/icons/more-horizontal-circle-01-stroke-rounded.svg" alt="more-horizontal-circle-01" height="20" />
        </div>
      </div>
      <div className="review-content">
        {renderReviewText()}
      </div>
      <div>{Rating(review.rating_review_score)}</div>
    </div>
  );
}

function App() {
  return (
    <div className="app">
      <ReviewList />
    </div>
  );
}

export default App;
