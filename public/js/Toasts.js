const toastTrigger = document.getElementById("liveToastBtn");
const toastLiveExample = document.getElementById("liveToast");
if (toastTrigger) {
  toastTrigger.addEventListener("click", () => {
    const toast = new bootstrap.Toast(toastLiveExample);

    toast.show();
  });
}

// const feePlaceholder = document.getElementById("feePlaceholder");
// const alert = (message, type) => {
//   const wrapper = document.createElement("div");

//   wrapper.innerHTML = [
//     `<div class="alert alert-${type} alert-dismissible"
//   role="alert">`,
//     `<div>${message}</div>`,
//     ' <button type="button" class = "btn-close" data-bs-dismiss = "alert" aria-label = "Close"></button>',
//     "</div>",
//   ].join("");
//   feePlaceholder.append(wrapper);
// };
// const feeTrigger = document.getElementById("feeBtn");
// if (feeTrigger) {
//   feeTrigger.addEventListener("click", () => {
//     alert("Fee will be0.0070 ETH", "success");
//   });
// }
