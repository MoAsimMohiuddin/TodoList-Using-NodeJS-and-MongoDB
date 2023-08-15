function myFunction() {
    // Get the checkbox
    let checkBox = document.getElementById("cb");
  
    // If the checkbox is checked, display the output text
    if (checkBox.checked == true){
        console.log("Checked");
        checkBox.classList.add('cb-thorugh-text');
        console.log(checkBox.classList);
    }else{
        checkBox.classList.remove('cb-thorugh-text');
    }
}