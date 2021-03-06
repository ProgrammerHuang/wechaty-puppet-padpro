import {
  ContactPayload,
  ContactType,
}                       from 'wechaty-puppet'

import {
  PadproContactPayload,
}                             from '../schemas'

import {
  isContactOfficialId,
  isRoomId,
}                           from './is-type'

export function contactRawPayloadParser (
  rawPayload: PadproContactPayload,
): ContactPayload {
  if (!rawPayload.userName) {
    /**
     * { big_head: '',
     *  city: '',
     *  country: '',
     *  intro: '',
     *  label: '',
     *  message: '',
     *  nick_name: '',
     *  provincia: '',
     *  py_initial: '',
     *  quan_pin: '',
     *  remark: '',
     *  remark_py_initial: '',
     *  remark_quan_pin: '',
     *  sex: 0,
     *  signature: '',
     *  small_head: '',
     *  status: 0,
     *  stranger: '',
     *  ticket: '',
     *  user_name: '' }
     */
    // console.log(rawPayload)
    throw Error('cannot get user_name from raw payload: ' + JSON.stringify(rawPayload))
  }

  if (isRoomId(rawPayload.userName)) {
    throw Error('Room Object instead of Contact!')
  }

  let contactType = ContactType.Unknown
  if (isContactOfficialId(rawPayload.userName)) {
    contactType = ContactType.Official
  } else {
    contactType = ContactType.Personal
  }

  const payload: ContactPayload = {
    alias     : rawPayload.remark,
    avatar    : rawPayload.bigHeadUrl,
    city      : rawPayload.city,
    gender    : rawPayload.sex,
    id        : rawPayload.userName,
    name      : rawPayload.nickName,
    province  : rawPayload.province,
    signature : (rawPayload.signature).replace('+', ' '),          // Stay+Foolish
    type      : contactType,
    weixin    : rawPayload.alias,
  }

  return payload
}
