import { expect } from 'chai';
import { ConnectPacket, Mqtt5PacketError, PublishPacket, SubscribePacket } from './classes';

describe('Classes - ConnectPacket', () => {

  it('should create a new class with some properties - 1', () => {
    const packet = new ConnectPacket({ clientId: 'client1'});
    expect(packet instanceof ConnectPacket).equal(true);
    expect(packet.cmd).equal('connect');
    expect(packet.clientId).equal('client1');
    expect(packet.clean).equal(false);
  });

  it('should create a new class with some properties - 2', () => {
    const packet = new ConnectPacket({ clientId: 'client2', keepalive: 10 });
    expect(packet instanceof ConnectPacket).equal(true);
    expect(packet.cmd).equal('connect');
    expect(packet.clientId).equal('client2');
    expect(packet.keepalive).equal(10);
    expect(packet.clean).equal(false);
  });

  it('should create a new class with some properties - 3', () => {
    const packet = new ConnectPacket({ clientId: 'client3', keepalive: 10, clean: true });
    expect(packet instanceof ConnectPacket).equal(true);
    expect(packet.cmd).equal('connect');
    expect(packet.clientId).equal('client3');
    expect(packet.keepalive).equal(10);
    expect(packet.clean).equal(true);
  });

});

describe('Classes - PublishPacket', () => {

  it('should create a new class with some properties - 1', () => {
    const packet = new PublishPacket({ topic: 'topic' });
    expect(packet instanceof PublishPacket).equal(true);
    expect(packet.cmd).equal('publish');
  });

  it('should fail to create a new class without required properties', () => {
    let err: any = null;
    try {
      const _packet = new PublishPacket({});
    } catch (error) {
      err = error;
    }
    expect(err instanceof Mqtt5PacketError).equal(true);
  });

});

describe('Classes - SubscribePacket', () => {

  it('should create a new class with some properties - 1', () => {
    const packet = new SubscribePacket({ subscriptions: [{ topic: 'topic', qos: 0 }] });
    expect(packet instanceof SubscribePacket).equal(true);
    expect(packet.cmd).equal('subscribe');
  });

  it('should fail to create a new class without required properties - 1', () => {
    let err: any = null;
    try {
      const _packet = new SubscribePacket({ subscriptions: [] });
    } catch (error) {
      err = error;
    }
    expect(err instanceof Mqtt5PacketError).equal(true);
  });

  it('should fail to create a new class without required properties - 2', () => {
    let err: any = null;
    try {
      const _packet = new SubscribePacket({});
    } catch (error) {
      err = error;
    }
    expect(err instanceof Mqtt5PacketError).equal(true);
  });

});