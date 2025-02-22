import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Observable, ReplaySubject } from 'rxjs';
import { ChatGoogleGenerativeAI } from '@langchain/google-genai';
import { HumanMessage, SystemMessage } from '@langchain/core/messages';
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';


@Injectable()
export class EvaluationService {
  private jobs = new Map<string, ReplaySubject<{ data: any }>>(); 

  constructor(private readonly configService: ConfigService) {}

  async startEvaluation(
    jobId: string,
    resumeFile: Express.Multer.File,
    jobAssignment: string,
  ) {
    const resumeText = await this.extractTextFromPDF(resumeFile.path);
    const aiStream = new ReplaySubject<{ data: any }>();
    this.jobs.set(jobId, aiStream);
    
    const apiKey = this.configService.get<string>('GOOGLE_API_KEY');
    if (!apiKey) {
      throw new Error('Missing API key. Set GOOGLE_API_KEY in .env');
    }

    const model = new ChatGoogleGenerativeAI({
      modelName: 'gemini-pro',
      streaming: true,
      apiKey,
    });

    const SYSTEM_MESSAGE = `You are an AI assistant that evaluates resumes strictly based on job requirements. 
    Provide a rating from 1 to 5, a detailed explanation, and a final verdict in JSON format.`;

    const USER_MESSAGE = `
    Given the following resume and job assignment, evaluate the resume on a scale of 1 to 5 based on how well it fits the job assignment. Provide a detailed explanation for the rating, highlighting the strengths and weaknesses of the resume in relation to the job assignment. Conclude with a final verdict on whether the candidate is a good fit for the position.

        Resume:

        ${resumeText}

        Job Assignment:
        ${jobAssignment}


        Rating (1-5):

        Explanation:

        Final Verdict:

        `;
    try {
      const responseStream = await model.stream([
        new SystemMessage(SYSTEM_MESSAGE),
        new HumanMessage(USER_MESSAGE),
      ]);
  
      for await (const chunk of responseStream) {
        aiStream.next({ data: chunk.content });
      }
      aiStream.complete();

    } catch (Error) {
      aiStream.error(Error);
    } 
  }

  getStream(jobId: string): Observable<{ data: any }> {
    const stream = this.jobs.get(jobId);
    if (!stream) {
      throw new NotFoundException('Job ID not found');
    }
    return stream.asObservable();
  }

  private async extractTextFromPDF(filePath: string): Promise<string> {
    const loader = new PDFLoader(filePath);
    const pages = await loader.load();
    return pages.map((page) => page.pageContent).join('\n');
  }
}