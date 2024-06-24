import { HANDLER_ID, TOTAL_LENGTH_SIZE } from './constants.js';

export const readHeader = (buffer) => {
  // 빅인디안, 리틀인디안
  // 서버는 보통 빅인디안 방식을 사용한다.
  // '빅인디안'은 순서대로 읽는 방식
  // '리틀인디안'은 순서를 거꾸로 읽는 방식
  // readUInt32BE(0) : 32비트만큼 읽는데 0번째 위치에서부터 읽는다.
  return {
    length: buffer.readUInt32BE(0),
    handlerId: buffer.readUInt16BE(TOTAL_LENGTH_SIZE),
  };
};

// 인자로 받는 length 는 메시지의 길이
export const writeHeader = (length, handlerId) => {
  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
  const buffer = Buffer.alloc(headerSize); // headerSize 는 6바이트

  // 메시지의 길이 + headerSize 를 해야 전체 길이를 알 수 있다.
  // 메시지 길이를 빅엔디안 방식으로 기록 (4바이트)
  buffer.writeInt32BE(length + headerSize, 0);
  buffer.writeInt16BE(handlerId, TOTAL_LENGTH_SIZE);

  return buffer;
};
