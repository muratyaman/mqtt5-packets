import { IBaseMqttPacket, IConnectPacket, IDisconnectPacket, IPingreqPacket, IPingrespPacket, IPublishPacket, ISubackPacket, ISubscribePacket, ISubscription, ITopicWithPayload, IUnsubscribePacket, MqttCommandType, MqttQoS, MqttUserDefinedProperties, mqttCommandTypeList } from './types';

export class Mqtt5PacketError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Mqtt5PacketError';
  }
}

export abstract class BaseMqttPacket implements IBaseMqttPacket {
  cmd: MqttCommandType = 'publish'; // to be set by child class
  constructor(obj: IBaseMqttPacket) {
    if (!mqttCommandTypeList.includes(obj.cmd)) throw new Mqtt5PacketError('invalid cmd');
    // copy properties from obj to this
    Object.assign(this, obj);
  }
}

export class ConnectPacket extends BaseMqttPacket implements IConnectPacket {
  protocolId: 'MQTT' = 'MQTT';
  protocolVersion    = 5;
  clean              = false;
  keepalive          = 0;
  clientId           = '';

  will      ?: ITopicWithPayload;
  username  ?: string;
  password  ?: string;
  properties?: MqttUserDefinedProperties;

  constructor(obj: Partial<Omit<IConnectPacket, 'cmd' | 'protocolId' | 'protocolVersion'>>) {
    // copy properties from obj to this
    super({ cmd: 'connect' });
    Object.assign(this, { ...obj, protocolId: 'MQTT', protocolVersion: 5 });
  }
}

export class PublishPacket extends BaseMqttPacket implements IPublishPacket {
  topic      = '';
  payload    = Buffer.alloc(0);
  qos        = 0;
  retain     = false;
  dup        = false;
  messageId ?: number;
  properties?: MqttUserDefinedProperties;

  constructor(obj: Partial<Omit<IPublishPacket, 'cmd'>>) {
    if (!obj.topic) throw new Mqtt5PacketError('invalid topic');
    super({ ...obj, cmd: 'publish' });
  }
  setPayload(payload: string, encoding: BufferEncoding = 'utf8') {
    this.payload = Buffer.from(payload, encoding);
  }
}

export class TopicSubscription implements ISubscription {
  topic = '';
  qos: MqttQoS = 0;
  constructor(obj: Partial<ISubscription>) {
    if (!obj.topic) throw new Mqtt5PacketError('invalid topic');
    Object.assign(this, obj);
  }
}

export class SubscribePacket extends BaseMqttPacket implements ISubscribePacket {
  subscriptions: ISubscription[] = [];
  messageId = 0;
  properties?: MqttUserDefinedProperties;

  constructor(obj: Partial<Omit<ISubscribePacket, 'cmd'>>) {
    if (!obj.subscriptions || !obj.subscriptions.length) throw new Mqtt5PacketError('invalid subscriptions');
    super({ ...obj, cmd: 'subscribe' });
  }
}

export class SubackPacket extends BaseMqttPacket implements ISubackPacket {
  granted: number[] = [];
  messageId = 0;
  properties?: MqttUserDefinedProperties;

  constructor(obj: Partial<Omit<ISubackPacket, 'cmd'>>) {
    super({ ...obj, cmd: 'suback' });
  }
}

export class PingreqPacket extends BaseMqttPacket implements IPingreqPacket {
  constructor() {
    super({ cmd: 'pingreq' });
  }
}

export class PingrespPacket extends BaseMqttPacket implements IPingrespPacket {
  constructor() {
    super({ cmd: 'pingresp' });
  }
}

export class DisconnectPacket extends BaseMqttPacket implements IDisconnectPacket {
  reasonCode = 0;
  properties?: MqttUserDefinedProperties;

  constructor(obj: Partial<Omit<IDisconnectPacket, 'cmd'>>) {
    super({ ...obj, cmd: 'disconnect' });
  }
}

export class UnsubscribePacket extends BaseMqttPacket implements IUnsubscribePacket {
  topics: string[] = [];
  messageId = 0;
  properties?: MqttUserDefinedProperties;

  constructor(obj: Partial<Omit<IUnsubscribePacket, 'cmd'>>) {
    if (!obj.topics || !obj.topics.length) throw new Mqtt5PacketError('invalid topics');
    super({ ...obj, cmd: 'unsubscribe' });
  }
}
