import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as _ from 'lodash';
import { GqlExecutionContext, GraphQLExecutionContext } from '@nestjs/graphql';

@Injectable()
export class TranslationInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext | GraphQLExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const req = context?.switchToHttp()?.getRequest() || GqlExecutionContext?.create(context)?.getContext()?.req;

    if (req?.url?.includes('marketplace/orders/gen-invoice/')) {
      return next?.handle();
    }

    const language = req?.headers?.['accept-language'];

    return next?.handle()?.pipe(map((data) => (data ? this?.translate(language, data) : undefined)));
  }

  translate(language, data) {
    // I removed this because we need to set default lang as Arabic
    // if (language === 'none' || !language) {
    //   return data;
    // }
    return this.toLanguage(JSON.parse(JSON.stringify(data)), language);
  }

  toLanguage(
    data: {
      translation: Array<{ _lang: string; name: string; text: string; description: string }>;
      text: string;
      name: string;
      description: string;
    },
    language,
  ) {
    if (_.isNil(data) || !_.isObject(data)) {
      return data;
    }

    if (Array.isArray(data?.translation) && data?.translation?.length > 0) {
      const translationObject = data.translation.find((element) => element?._lang === language);

      if (translationObject) {
        const text = data?.text;
        const name = data?.name;
        const description = data?.description;
        const _lang = translationObject?._lang == 'ar' ? 'en' : 'ar';
        _.merge(data, {
          name: translationObject?.name,
          text: translationObject?.text,
          description: translationObject?.description,
          translation: [{ text, name, _lang, description }],
        });
      }
    }

    // if(language){
    //    delete data.translation;
    // }

    const keys = Object.keys(data);

    for (let i = 0; i < keys.length; i++) {
      data[keys[i]] = this.toLanguage(data[keys[i]], language);
    }
    return data;
  }
}
