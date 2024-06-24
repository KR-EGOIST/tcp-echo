import net from 'net';
import { writeHeader, readHeader } from './utils.js';
import { HANDLER_ID, MAX_MESSAGE_LENGTH, TOTAL_LENGTH_SIZE } from './constants.js';
import handlers from './handlers/index.js';

const PORT = 5555;

const server = net.createServer((socket) => {
  console.log(`Client connected from: ${socket.remoteAddress}:${socket.remotePort}`);

  socket.on('data', (data) => {
    const buffer = Buffer.from(data); // 버퍼 객체의 메서드를 사용하기 위해 변환

    const { handlerId, length } = readHeader(buffer);
    console.log(`handlerId: ${handlerId}, length: ${length}`);

    // 메시지 길이 확인
    if (length > MAX_MESSAGE_LENGTH) {
      console.log(`Error: Message length ${length}`);
      socket.write(`Error: Message too long`);
      socket.end();
      return;
    }

    const handler = handlers[handlerId];

    // 핸들러 ID 확인
    if (!handler) {
      console.error(`Error: No handler found for ID ${handlerId}`);
      socket.write(`Error: Invalid handler ID ${handlerId}`);
      socket.end();
      return;
    }

    const headderSize = TOTAL_LENGTH_SIZE + HANDLER_ID; // 6
    // 메시지 추출
    const message = buffer.slice(headderSize);

    console.log(`client 에게 받은 메세지: ${message}`);

    const responseMessage = handler(message);
    const responseBuffer = Buffer.from(responseMessage);

    const header = writeHeader(responseBuffer.length, handlerId);
    const responsePacket = Buffer.concat([header, responseBuffer]);

    socket.write(responsePacket); // 'data' 이벤트로 받은 data를 같은 socket에게 쓰기
  });

  // end는 한쪽의 연결이 끝날때
  socket.on('end', () => {
    console.log(`Client disConnected from: ${socket.remoteAddress}:${socket.remotePort}`);
  });

  socket.on('error', () => {
    console.error(`Socket error: , ${err}`);
  });
});

server.listen(PORT, () => {
  console.log(`Echo Server listening on port: ${PORT}`);
  console.log(server.address());
});
