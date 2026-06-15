import { Injectable } from '@nestjs/common';
import { IncludeNode } from 'src/types/include-query';

@Injectable()
export class QueryService {
  buildInclude(include: string | undefined) {
    if (!include) return {};
    const splitted = include.split(',');
    const result: Record<string, IncludeNode> = {};
    for (let i = 0; i < splitted.length; i++) {
      let current = result;
      const nestedJoin = splitted[i].split('.');

      for (let e = 0; e < nestedJoin.length; e++) {
        const part = nestedJoin[e];
        current[part] = current[part] ?? { include: {} };
        current = current[part].include;
      }
    }
  }
}
