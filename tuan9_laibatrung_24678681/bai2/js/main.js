$(function () {
  const $form = $("#tourForm");
  const $modal = $("#tourModal");
  const modalInstance = bootstrap.Modal.getOrCreateInstance($modal[0]);

  function showError(fieldId, message) {
    $("#" + fieldId).text(message);
  }

  function clearError(fieldId) {
    showError(fieldId, "");
  }

  function formatDateForDisplay(value) {
    const [year, month, day] = value.split("-");
    return [day, month, year].join("/");
  }

  function formatCurrency(value) {
    return Number(value).toLocaleString("vi-VN") + " VND";
  }

  function getSelectedFileName() {
    const input = $("#tourImage")[0];
    return input.files.length ? input.files[0].name : "";
  }

  function validateRequiredText(value, errorId, fieldName) {
    if (!value) {
      showError(errorId, fieldName + " là trường bắt buộc.");
      return false;
    }

    clearError(errorId);
    return true;
  }

  function validateTourCode() {
    const value = $("#tourCode").val().trim();
    const pattern = /^[A-Z]{3}-[A-Z]{3}-\d{2}-\d{4}$/;

    if (!validateRequiredText(value, "tourCodeError", "Mã tour")) {
      return false;
    }

    if (!pattern.test(value)) {
      showError("tourCodeError", "Mã tour phải theo mẫu XXX-XXX-mm-yyyy.");
      return false;
    }

    clearError("tourCodeError");
    return true;
  }

  function validateItinerary() {
    const value = $("#itinerary").val().trim();
    return validateRequiredText(value, "itineraryError", "Hành trình");
  }

  function validateDepartureDate() {
    const value = $("#departureDate").val();

    if (!value) {
      showError("departureDateError", "Ngày khởi hành là trường bắt buộc.");
      return false;
    }

    const departureDate = new Date(value + "T00:00:00");
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const minDepartureDate = new Date(today);
    minDepartureDate.setDate(minDepartureDate.getDate() + 30);

    if (departureDate <= minDepartureDate) {
      showError(
        "departureDateError",
        "Ngày khởi hành phải sau ngày hiện tại ít nhất 30 ngày."
      );
      return false;
    }

    clearError("departureDateError");
    return true;
  }

  function validateDuration() {
    const value = $("#duration").val().trim();
    return validateRequiredText(value, "durationError", "Thời gian");
  }

  function validatePrice() {
    const value = $("#price").val().trim();

    if (!value) {
      showError("priceError", "Giá tour là trường bắt buộc.");
      return false;
    }

    if (Number(value) <= 0) {
      showError("priceError", "Giá tour phải là số lớn hơn 0.");
      return false;
    }

    clearError("priceError");
    return true;
  }

  function validateImage() {
    const fileName = getSelectedFileName();

    if (!fileName) {
      showError("tourImageError", "Ảnh đại diện là trường bắt buộc.");
      return false;
    }

    if (!/\.(jpg|gif|png)$/i.test(fileName)) {
      showError("tourImageError", "Ảnh đại diện phải có đuôi jpg, gif hoặc png.");
      return false;
    }

    clearError("tourImageError");
    return true;
  }

  function validateForm() {
    const checks = [
      validateTourCode(),
      validateItinerary(),
      validateDepartureDate(),
      validateDuration(),
      validatePrice(),
      validateImage(),
    ];

    return checks.every(Boolean);
  }

  function appendTourToTable() {
    const nextIndex = $("#tourTableBody tr").length + 1;
    const rowHtml = `
      <tr>
        <td>${nextIndex}</td>
        <td>${$("#tourCode").val().trim()}</td>
        <td>${$("#itinerary").val().trim()}</td>
        <td>${formatDateForDisplay($("#departureDate").val())}</td>
        <td>${$("#duration").val().trim()}</td>
        <td>${formatCurrency($("#price").val().trim())}</td>
        <td>${getSelectedFileName()}</td>
      </tr>
    `;

    $("#tourTableBody").append(rowHtml);
  }

  function resetFormState() {
    $form[0].reset();
    $(".error-message").text("");
  }

  $("#tourCode").on("blur", validateTourCode);
  $("#itinerary").on("blur", validateItinerary);
  $("#departureDate").on("change", validateDepartureDate);
  $("#duration").on("blur", validateDuration);
  $("#price").on("blur", validatePrice);
  $("#tourImage").on("change", validateImage);
  $("#openTourLink").on("click", function (event) {
    event.preventDefault();
  });

  $("#saveTour").on("click", function () {
    if (!validateForm()) {
      return;
    }

    appendTourToTable();
    modalInstance.hide();
    resetFormState();
  });

  $modal.on("hidden.bs.modal", function () {
    resetFormState();
  });
});
