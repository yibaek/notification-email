import { decode } from 'html-entities';

export class StringUtil {
  static htmlDecode(html: string) {
    return decode(html);
  }
}
