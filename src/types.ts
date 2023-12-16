export type MqttCommandType = 'connect' | 'publish' | 'subscribe' | 'suback' | 'pingreq' | 'pingresp' | 'disconnect' | 'unsubscribe' | 'unsuback';
export const mqttCommandTypeList = ['connect', 'publish', 'subscribe', 'suback', 'pingreq', 'pingresp', 'disconnect', 'unsubscribe', 'unsuback'];

export type MqttQoS = 0 | 1 | 2;

export type MqttUserDefinedProperties = Record<string, string | string[]>;

/**
 * Base MQTT packet
 * for common properties for all MQTT packets
 */
export interface IBaseMqttPacket {
  cmd: MqttCommandType;
}

/**
 * Reusable data model with topic, payload, QoS and retain flag
 */
export interface ITopicWithPayload {
  topic      : string;
  payload    : Buffer;
  /**
   * Quality of Service: 0, 1 or 2
   */
  qos        : number;
  retain     : boolean;
  properties?: MqttUserDefinedProperties;
}

/**
 * CONNECT packet
 */
export interface IConnectPacket extends IBaseMqttPacket {
  //cmd: 'connect';
  /**
   * Value is "MQTT"
   */
  protocolId: 'MQTT';

  /**
   * Value is 5
   */
  protocolVersion: number;

  /**
   * Start a clean session or continue an existing one (use persistent session)
   * which requires using the same clientId in between disconnections and reconnections.
   */
  clean: boolean;

  /**
   * Time interval measured in seconds
   */
  keepalive  : number;
  clientId   : string;
  username  ?: string;
  password  ?: string;
  will      ?: ITopicWithPayload;
  properties?: MqttUserDefinedProperties;
}

type IPublishPacketWithTopic = IBaseMqttPacket & ITopicWithPayload;

/**
 * PUBLISH packet
 */
export interface IPublishPacket extends IPublishPacketWithTopic {
  //cmd: 'publish';
  dup       : boolean;
  messageId?: number;
}

/**
 * Subscription model with topic, QoS and other settings
 */
export interface ISubscription {
  topic: string;
  qos  : MqttQoS;

  /**
   * No Local
   */
  nl?: boolean;

  /**
   * Retain As Published
   */
  rap?: boolean;

  /**
   * Retain Handling
   */
  rh?: number;

  properties?: MqttUserDefinedProperties;
}

// SUBSCRIBE packet
export interface ISubscribePacket extends IBaseMqttPacket {
  //cmd: 'subscribe';
  subscriptions : ISubscription[];
  messageId     : number;
  properties   ?: MqttUserDefinedProperties;
}

/**
 * SUBACK packet
 */
export interface ISubackPacket extends IBaseMqttPacket {
  //cmd: 'suback';
  granted    : number[];  // Array of granted QoS levels
  messageId  : number;
  properties?: MqttUserDefinedProperties;
}

/**
 * PINGREQ packet
 */
export interface IPingreqPacket extends IBaseMqttPacket {
  //cmd: 'pingreq';
}

/**
 * PINGRESP packet
 */
export interface IPingrespPacket extends IBaseMqttPacket {
  //cmd: 'pingresp';
}

/**
 * DISCONNECT packet
 */
export interface IDisconnectPacket extends IBaseMqttPacket {
  //cmd: 'disconnect';
  reasonCode?: number;
  properties?: MqttUserDefinedProperties;
}

/**
 * UNSUBSCRIBE packet
 */
export interface IUnsubscribePacket extends IBaseMqttPacket {
  //cmd: 'unsubscribe';
  topics     : string[];
  messageId  : number;
  properties?: MqttUserDefinedProperties;
}

/**
 * UNSUBACK packet
 */
export interface IUnsubackPacket extends IBaseMqttPacket {
  //cmd: 'unsuback';
  messageId  : number;
  properties?: MqttUserDefinedProperties;
}
