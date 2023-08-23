import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from 'nodejs-server/environments/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  photoUrl(_t24: any) {
    throw new Error('Method not implemented.');
  }
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  @ViewChild('textInput') textInput!: ElementRef;

  constructor(private dataService: DataService) {}

  canvasContext: CanvasRenderingContext2D | null = null; 

  photos: string[] = [];
  stream: MediaStream | undefined;
  capturedPhoto: string | null = null;

  drawing = false;
  isDrawing: boolean = false;
  lastX: number = 0;
  lastY: number = 0;

  async startCamera() {
    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (this.videoElement) {
        this.videoElement.nativeElement.srcObject = this.stream;
      }
    } catch (error) {
      console.error('Error accessing webcam:', error);
    }
  }

  ngOnInit() {
    this.startCamera();
  }

  addTextToCanvas() {
    if (this.canvasElement && this.textInput) {
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');
  
      const text = this.textInput.nativeElement.value; // Kullanıcının girdiği metin
  
      // Metin özelliklerini ayarlar
      context.font = '20px Arial';
      context.fillStyle = 'green';
      context.textAlign = 'center';
  
      // Metni canvasa ekler
      context.fillText(text, canvas.width / 2, canvas.height / 2);
    }
  }
  

  capturePhoto() {
    if (this.videoElement && this.canvasElement) {
      const video = this.videoElement.nativeElement;
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
    }
  }

  downloadCanvas() {
    if (this.canvasElement) {
      const canvas = this.canvasElement.nativeElement;
      const link = document.createElement('a');
      link.href = canvas.toDataURL();
      link.download = 'canvas_image.png';
      link.click();
    }
  }

  stopCamera() {
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
    }
  }

  handleMouseDown(event: MouseEvent) {
    this.drawing = true;
    this.lastX = event.offsetX;
    this.lastY = event.offsetY;
  }

  handleMouseMove(event: MouseEvent) {
    if (this.drawing) {
      const canvas = this.canvasElement.nativeElement;
      const context = canvas.getContext('2d');

      const x = event.offsetX;
      const y = event.offsetY;

      context.lineWidth = 5;
      context.lineCap = 'round';
      context.strokeStyle = 'red';

      context.beginPath();
      context.moveTo(this.lastX, this.lastY);
      context.lineTo(x, y);
      context.stroke();

      this.lastX = x;
      this.lastY = y;
    }
  }

  handleMouseUp() {
    this.drawing = false;
  }

  removeCapturedCanvas() {
    const canvas = this.canvasElement.nativeElement;
    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    this.capturedPhoto = null;
  }

  sendToServer() {
    const photoData = this.canvasElement.nativeElement.toDataURL('image/png');
    this.dataService.savePhotoToServer(photoData).subscribe(
      (response) => {
        console.log('Photo saved successfully', response);
      },
      (error) => {
        console.error('Error saving photo', error);
      }
    );
  }
}
