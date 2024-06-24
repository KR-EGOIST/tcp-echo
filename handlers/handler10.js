const handler10 = (data) => {
  // 수신한 데이터를 대문자로 변환
  // data 는 buffer 이기 때문에 문자로 변환한다음 소문자를 대문자로 변환
  const processedData = data.toString().toUpperCase();
  return Buffer.from(processedData);
};

export default handler10;
