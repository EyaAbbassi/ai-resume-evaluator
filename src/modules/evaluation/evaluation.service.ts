import { Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class EvaluationService {
 private evaluations: Map<string, any> = new Map();

 async startEvaluation(jobId: string, resume: Express.Multer.File, jobAssignment: string) {
  // Store job details temporarily (in-memory storage for simplicity)
  this.evaluations.set(jobId, { resume, jobAssignment });
 }

 streamEvaluation(jobId: string): Observable<any> {
  return new Observable((observer) => {
   const evaluationData = this.evaluations.get(jobId);
   if (!evaluationData) {
    observer.error({ message: 'Job ID not found' });
    return;
   }

   // Simulating real-time streaming with incremental JSON responses
   const chunks = [
    { rating: 4 },
    { explanation: "Candidate has strong full-stack experience but lacks LangChain expertise." },
    { final_verdict: "Suitable but needs AI-related improvement." },
   ];

   let index = 0;

   const interval = setInterval(() => {
    if (index < chunks.length) {
     observer.next(chunks[index]); // Send next chunk
     index++;
    } else {
     clearInterval(interval);
     observer.complete(); // Finish streaming
    }
   }, 2000); // Send every 2 seconds (simulating AI processing)
  });
 }
}
