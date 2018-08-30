import '../polyfills';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { CourseModule } from './course.module';

platformBrowserDynamic().bootstrapModule(CourseModule);
