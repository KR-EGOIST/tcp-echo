import net from 'net';
import { writeHeader, readHeader } from './utils.js';
import { TOTAL_LENGTH_SIZE, HANDLER_ID } from './constants.js';

const HOST = 'localhost';
const PORT = 5555;

const client = new net.Socket();

client.connect(PORT, HOST, () => {
  console.log('Connected to server...');

  const message = 'Hello';
  const buffer = Buffer.from(message);

  const header = writeHeader(buffer.length, 11);
  const packet = Buffer.concat([header, buffer]);
  client.write(packet); // write 메서드로 버퍼 쓰기
});

client.on('data', (data) => {
  const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

  const { handlerId, length } = readHeader(buffer);
  console.log(`handlerId: ${handlerId}, length: ${length}`);

  const headerSize = TOTAL_LENGTH_SIZE + HANDLER_ID;
  // 메시지 추출
  const message = buffer.slice(headerSize); // 앞의 헤더 부분을 잘라낸다.

  console.log(`server 에게 받은 메세지: ${message}`);
});

// close는 양쪽의 연결이 완전히 끝날때
client.on('close', () => {
  console.log('Connection closed');
});

client.on('error', (err) => {
  console.error('Client error:', err);
});
