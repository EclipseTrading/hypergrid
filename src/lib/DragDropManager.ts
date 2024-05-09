export class DragDropManager {

    private dragging: boolean = false;

    constructor(
        private canvas: HTMLCanvasElement,
        private dragImage: HTMLElement) {
        this.canvas.addEventListener('dragstart', (e: DragEvent) => this.dragStart(e));
        this.canvas.addEventListener('dragover', (e: DragEvent) => e.preventDefault());
    }

    public beDragging(ctrlKey: boolean): void {
        this.dragging = true;
        if (ctrlKey) {
            this.canvas.draggable = true;
        }
        this.disableDocumentElementSelection();
    }

    public isDragging(): boolean {
        return this.dragging;
    }

    public beNotDragging(): void {
        this.dragging = false;
        this.canvas.draggable = false;
        this.enableDocumentElementSelection();
    }

    private dragStart(e: DragEvent) {
        e.dataTransfer.setDragImage(this.dragImage, 0, 0);
    }

    private disableDocumentElementSelection(): void {
        var style = document.body.style;
        style.cssText = style.cssText + '-webkit-user-select: none';
    }

    private enableDocumentElementSelection(): void {
        var style = document.body.style;
        style.cssText = style.cssText.replace('-webkit-user-select: none', '');
    }
}
