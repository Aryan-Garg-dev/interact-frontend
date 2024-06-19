import moment from 'moment';

export const getFormattedTime = (time: string) => moment(time).format('YYYY-MM-DDTHH:mm:ss') + '+05:30';
export const getInputFieldFormatTime = (date: Date) => moment(date).format('YYYY-MM-DDTHH:MM');
