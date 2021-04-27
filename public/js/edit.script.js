document.addEventListener(
  "DOMContentLoaded",
  () => {
    console.log("new-app JS imported successfully!");
  },
  false
  );
  
  
  
  // -------------------
  // edit notes DOM: see all users notes
  reviewForm = document.getElementById("review-form");
  submitForm = document.getElementById("submit-review-form");


allReviewsLink.addEventListener("click", 
() => {
  console.log("you clicked to see all reviews");
  backToMyReviews.style.display = "block"
  allReviewsLink.style.display = "none"
  myReviews.style.display = "none"
  allReviews.style.display = "block"
  
});
// edit notes DOM: back to only users notes 
backToMyReviews.addEventListener("click", 
() => {
  console.log("you clicked to see just your reviews");
  allReviewsLink.style.display = "block"
  myReviews.style.display = "block"
  allReviews.style.display = "none"
  backToMyReviews.style.display = "none"
});
// ------------------

