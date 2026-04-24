$(function () {
  const courseFees = {
    "2 tuần": 5000000,
    "4 tuần": 8000000,
    "6 tuần": 9000000,
  };

  const $form = $("#registerForm");
  const $modal = $("#registerModal");
  const modalInstance = bootstrap.Modal.getOrCreateInstance($modal[0]);

  function showError(fieldId, message) {
    $("#" + fieldId).text(message);
  }

  function clearError(fieldId) {
    showError(fieldId, "");
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString("vi-VN") + " VNĐ";
  }

  function formatDateForDisplay(value) {
    const [year, month, day] = value.split("-");
    return [day, month, year].join("/");
  }

  function calculateAge(dateString) {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  }

  function validateFullName() {
    const value = $("#fullName").val().trim();
    const pattern = /^([A-ZÀ-ỸĐ][a-zà-ỹđ]*)(\s+[A-ZÀ-ỸĐ][a-zà-ỹđ]*)+$/;

    if (!value) {
      showError("fullNameError", "Họ tên không được để trống.");
      return false;
    }

    if (!pattern.test(value)) {
      showError(
        "fullNameError",
        "Họ tên phải từ 2 từ trở lên và mỗi chữ cái đầu phải viết hoa."
      );
      return false;
    }

    clearError("fullNameError");
    return true;
  }

  function validatePhone() {
    const value = $("#phone").val().trim();
    const pattern = /^\d{3}-\d{6}$/;

    if (!value) {
      showError("phoneError", "Số điện thoại không được để trống.");
      return false;
    }

    if (!pattern.test(value)) {
      showError("phoneError", "Số điện thoại phải có dạng XXX-YYYYYY.");
      return false;
    }

    clearError("phoneError");
    return true;
  }

  function validateBirthDate() {
    const value = $("#birthDate").val();

    if (!value) {
      showError("birthDateError", "Ngày sinh không được để trống.");
      return false;
    }

    const birthDate = new Date(value);
    if (Number.isNaN(birthDate.getTime())) {
      showError("birthDateError", "Ngày sinh không hợp lệ.");
      return false;
    }

    const age = calculateAge(value);
    if (!(age > 15 && age < 18)) {
      showError("birthDateError", "Tuổi phải trên 15 và dưới 18.");
      return false;
    }

    clearError("birthDateError");
    return true;
  }

  function validateAddress() {
    const value = $("#address").val().trim();

    if (!value) {
      showError("addressError", "Địa chỉ không được để trống.");
      return false;
    }

    clearError("addressError");
    return true;
  }

  function validateCourse() {
    const value = $("#course").val();

    if (!value) {
      showError("courseError", "Vui lòng chọn khóa học.");
      $("#tuition").val("");
      return false;
    }

    $("#tuition").val(formatCurrency(courseFees[value]));
    clearError("courseError");
    return true;
  }

  function validateAvatar() {
    const input = $("#avatar")[0];
    const fileName = input.files.length ? input.files[0].name.toLowerCase() : "";

    if (!fileName) {
      showError("avatarError", "Vui lòng chọn ảnh đại diện.");
      return false;
    }

    if (!/\.(jpg|jpeg|png|gif)$/.test(fileName)) {
      showError("avatarError", "Ảnh đại diện phải có đuôi .jpg, .png hoặc .gif.");
      return false;
    }

    clearError("avatarError");
    return true;
  }

  function appendStudent() {
    const nextIndex = $("#studentTableBody tr").length + 1;
    const rowHtml = `
      <tr>
        <td>${nextIndex}</td>
        <td>${$("#fullName").val().trim()}</td>
        <td>${$("#gender").val()}</td>
        <td>${$("#phone").val().trim()}</td>
        <td>${formatDateForDisplay($("#birthDate").val())}</td>
        <td>${$("#address").val().trim()}</td>
        <td>${$("#course").val()}</td>
        <td>${$("#tuition").val()}</td>
      </tr>
    `;

    $("#studentTableBody").append(rowHtml);
  }

  function validateForm() {
    const checks = [
      validateFullName(),
      validatePhone(),
      validateBirthDate(),
      validateAddress(),
      validateCourse(),
      validateAvatar(),
    ];

    return checks.every(Boolean);
  }

  $("#course").on("change", validateCourse);
  $("#fullName").on("blur", validateFullName);
  $("#phone").on("blur", validatePhone);
  $("#birthDate").on("change", validateBirthDate);
  $("#address").on("blur", validateAddress);
  $("#avatar").on("change", validateAvatar);

  $("#saveStudent").on("click", function () {
    if (!validateForm()) {
      return;
    }

    appendStudent();
    $form[0].reset();
    $("#tuition").val("");
    $(".error-message").text("");
    modalInstance.hide();
  });

  $modal.on("hidden.bs.modal", function () {
    $form[0].reset();
    $("#tuition").val("");
    $(".error-message").text("");
  });
});
