const toastTrigger = document.getElementById("liveToastBtn");
const toastAlert = document.getElementById("liveToast");
if (toastTrigger) {
  toastTrigger.addEventListener("click", () => {
    const toast = new bootstrap.Toast(toastAlert);

    toast.show();
  });
}

function CreateToast(danger, msg){
  const toastMsg = document.getElementById("toast-msg");
  if(danger){
    toastMsg.classList.add("alert-danger");
    toastMsg.classList.remove("alert-success");  
  }
  else{
    toastMsg.classList.remove("alert-danger");
    toastMsg.classList.add("alert-success"); 
  }
  toastMsg.innerHTML = msg;
  const toast = new bootstrap.Toast(toastAlert);
  toast.show();
}

export { CreateToast };
