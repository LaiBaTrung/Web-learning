let thang = 2;

switch (thang) {
  case 1:
  case 3:
  case 5:
  case 7:
  case 8:
  case 10:
  case 12:
    console.log(`Tháng ${thang} có 31 ngày`);
    break;
  case 4:
  case 6:
  case 9:
  case 11:
    console.log(`Tháng ${thang} có 30 ngày`);
    break;
  case 2:
    console.log(`Tháng ${thang} có 28 ngày`);
    break;
  default:
    console.log("Tháng không hợp lệ!");
}
