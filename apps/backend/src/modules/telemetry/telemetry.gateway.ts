import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: { origin: '*' },
})
export class TelemetryGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`📡 [AutoOS Gateway] Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`📡 [AutoOS Gateway] Client disconnected: ${client.id}`);
  }

  // Broadcast bay changes across floor screens
  broadcastBayUpdate(bayData: any) {
    if (this.server) {
      this.server.emit('bay_updated', bayData);
    }
  }

  // Broadcast Job Card state transitions
  broadcastJobStatusChange(jobData: any) {
    if (this.server) {
      this.server.emit('job_status_changed', jobData);
    }
  }

  // Broadcast real-time fluid pulses
  broadcastFluidPulse(pulseData: any) {
    if (this.server) {
      this.server.emit('fluid_dispensed', pulseData);
    }
  }

  @SubscribeMessage('ping_floor')
  handlePing(client: Socket, payload: any) {
    return { event: 'pong_floor', data: { timestamp: new Date().toISOString(), status: 'ONLINE' } };
  }
}
