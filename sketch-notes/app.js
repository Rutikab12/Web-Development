class SketchNotesApp {
    constructor() {
        this.canvas = document.getElementById('drawing-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.isDrawing = false;
        this.currentTool = 'pen';
        this.currentColor = '#000000';
        this.currentSize = 5;
        this.currentOpacity = 1;
        this.isGridVisible = false;
        this.isPanMode = false;
        this.zoomLevel = 1;
        this.panOffset = { x: 0, y: 0 };
        this.pages = [{ strokes: [], zoom: 1, pan: { x: 0, y: 0 } }];
        this.currentPage = 0;
        this.undoStack = [];
        this.redoStack = [];
        this.lastX = 0;
        this.lastY = 0;
        
        // Shape drawing state
        this.startX = 0;
        this.startY = 0;
        this.isShapeDrawing = false;
        this.shapePreview = null;
        
        // Text state
        this.textPosition = null;
        
        // Pan state
        this.isPanning = false;
        this.lastPanX = 0;
        this.lastPanY = 0;
        
        this.init();
    }

    init() {
        this.setupCanvas();
        this.setupEventListeners();
        this.setupColorPresets();
        this.setupTemplates();
        this.updateUI();
        this.saveState(); // Initial state for undo
    }

    setupCanvas() {
        const container = document.getElementById('canvas-container');
        const rect = container.getBoundingClientRect();
        this.canvas.width = Math.max(800, rect.width);
        this.canvas.height = Math.max(600, rect.height);
        
        // Set up canvas context
        this.ctx.lineCap = 'round';
        this.ctx.lineJoin = 'round';
        this.ctx.imageSmoothingEnabled = true;
        
        // Set canvas background to white
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Handle resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
    }

    resizeCanvas() {
        const container = document.getElementById('canvas-container');
        const rect = container.getBoundingClientRect();
        
        // Save current canvas state
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        
        this.canvas.width = Math.max(800, rect.width);
        this.canvas.height = Math.max(600, rect.height);
        
        // Restore canvas state
        this.ctx.putImageData(imageData, 0, 0);
    }

    setupEventListeners() {
        // Canvas events
        this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
        this.canvas.addEventListener('mousemove', this.draw.bind(this));
        this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
        this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));

        // Touch events
        this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchmove', this.handleTouch.bind(this));
        this.canvas.addEventListener('touchend', this.stopDrawing.bind(this));

        // Tool selection
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.selectTool(btn.dataset.tool);
            });
        });

        // Color controls
        const colorInput = document.getElementById('color-input');
        if (colorInput) {
            colorInput.addEventListener('change', (e) => {
                this.currentColor = e.target.value;
                this.updateColorPresets();
            });
        }

        // Size and opacity sliders
        const sizeSlider = document.getElementById('size-slider');
        if (sizeSlider) {
            sizeSlider.addEventListener('input', (e) => {
                this.currentSize = parseInt(e.target.value);
                document.getElementById('size-value').textContent = this.currentSize;
            });
        }

        const opacitySlider = document.getElementById('opacity-slider');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                this.currentOpacity = parseInt(e.target.value) / 100;
                document.getElementById('opacity-value').textContent = e.target.value;
            });
        }

        // Toolbar buttons
        this.setupToolbarEvents();
        this.setupModalControls();

        // Page management
        const newPageBtn = document.getElementById('new-page-btn');
        if (newPageBtn) {
            newPageBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.addNewPage();
            });
        }

        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));

        // Mobile sidebar toggle
        const mobileToggle = document.getElementById('mobile-sidebar-toggle');
        if (mobileToggle) {
            mobileToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.toggle('open');
            });
        }

        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                document.getElementById('sidebar').classList.remove('open');
            });
        }

        // Header buttons
        const templatesBtn = document.getElementById('templates-btn');
        if (templatesBtn) {
            templatesBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('template-modal').classList.remove('hidden');
            });
        }

        const exportBtn = document.getElementById('export-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('export-modal').classList.remove('hidden');
            });
        }

        const newNotebookBtn = document.getElementById('new-notebook');
        if (newNotebookBtn) {
            newNotebookBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.newNotebook();
            });
        }
    }

    setupToolbarEvents() {
        const clearBtn = document.getElementById('clear-canvas');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearCanvas());
        }

        const gridBtn = document.getElementById('toggle-grid');
        if (gridBtn) {
            gridBtn.addEventListener('click', () => this.toggleGrid());
        }

        const undoBtn = document.getElementById('undo-btn');
        if (undoBtn) {
            undoBtn.addEventListener('click', () => this.undo());
        }

        const redoBtn = document.getElementById('redo-btn');
        if (redoBtn) {
            redoBtn.addEventListener('click', () => this.redo());
        }

        const zoomInBtn = document.getElementById('zoom-in');
        if (zoomInBtn) {
            zoomInBtn.addEventListener('click', () => this.zoom(1.2));
        }

        const zoomOutBtn = document.getElementById('zoom-out');
        if (zoomOutBtn) {
            zoomOutBtn.addEventListener('click', () => this.zoom(0.8));
        }

        const panBtn = document.getElementById('pan-mode');
        if (panBtn) {
            panBtn.addEventListener('click', () => this.togglePanMode());
        }
    }

    setupModalControls() {
        // Template modal
        const modalClose = document.getElementById('modal-close');
        if (modalClose) {
            modalClose.addEventListener('click', () => {
                document.getElementById('template-modal').classList.add('hidden');
            });
        }

        const modalOverlay = document.getElementById('modal-overlay');
        if (modalOverlay) {
            modalOverlay.addEventListener('click', () => {
                document.getElementById('template-modal').classList.add('hidden');
            });
        }

        // Export modal
        const exportClose = document.getElementById('export-close');
        if (exportClose) {
            exportClose.addEventListener('click', () => {
                document.getElementById('export-modal').classList.add('hidden');
            });
        }

        const exportOverlay = document.getElementById('export-overlay');
        if (exportOverlay) {
            exportOverlay.addEventListener('click', () => {
                document.getElementById('export-modal').classList.add('hidden');
            });
        }

        // Text modal
        const textClose = document.getElementById('text-close');
        if (textClose) {
            textClose.addEventListener('click', () => {
                document.getElementById('text-modal').classList.add('hidden');
            });
        }

        const textOverlay = document.getElementById('text-overlay');
        if (textOverlay) {
            textOverlay.addEventListener('click', () => {
                document.getElementById('text-modal').classList.add('hidden');
            });
        }

        // Font size slider
        const fontSizeSlider = document.getElementById('font-size-slider');
        if (fontSizeSlider) {
            fontSizeSlider.addEventListener('input', (e) => {
                document.getElementById('font-size-value').textContent = e.target.value + 'px';
            });
        }

        // Add text button
        const addTextBtn = document.getElementById('add-text-btn');
        if (addTextBtn) {
            addTextBtn.addEventListener('click', () => {
                this.addText();
            });
        }

        // Export buttons
        const exportPng = document.getElementById('export-png');
        if (exportPng) {
            exportPng.addEventListener('click', () => this.exportAs('png'));
        }

        const exportPdf = document.getElementById('export-pdf');
        if (exportPdf) {
            exportPdf.addEventListener('click', () => this.exportAs('pdf'));
        }

        const exportSvg = document.getElementById('export-svg');
        if (exportSvg) {
            exportSvg.addEventListener('click', () => this.exportAs('svg'));
        }
    }

    setupColorPresets() {
        const colors = [
            '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF',
            '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080',
            '#FFC0CB', '#A52A2A', '#808080', '#000080', '#008000'
        ];

        const presetsContainer = document.getElementById('color-presets');
        if (!presetsContainer) return;

        presetsContainer.innerHTML = '';
        colors.forEach(color => {
            const preset = document.createElement('div');
            preset.className = 'color-preset';
            preset.style.backgroundColor = color;
            preset.addEventListener('click', () => {
                this.currentColor = color;
                const colorInput = document.getElementById('color-input');
                if (colorInput) {
                    colorInput.value = color;
                }
                this.updateColorPresets();
            });
            presetsContainer.appendChild(preset);
        });
    }

    updateColorPresets() {
        document.querySelectorAll('.color-preset').forEach(preset => {
            preset.classList.remove('active');
            if (preset.style.backgroundColor === this.rgbToHex(this.currentColor) || 
                preset.style.backgroundColor.toLowerCase() === this.currentColor.toLowerCase()) {
                preset.classList.add('active');
            }
        });
    }

    rgbToHex(rgb) {
        if (rgb.charAt(0) === '#') return rgb;
        const rgbArray = rgb.match(/\d+/g);
        if (!rgbArray) return rgb;
        return '#' + rgbArray.map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }

    setupTemplates() {
        const templates = [
            { id: 'blank', name: 'Blank Canvas', description: 'Start with a clean slate', icon: '📝' },
            { id: 'cornell', name: 'Cornell Notes', description: 'Structured note-taking layout', icon: '📋' },
            { id: 'mindmap', name: 'Mind Map', description: 'Central topic with branches', icon: '🧠' },
            { id: 'timeline', name: 'Timeline', description: 'Chronological organization', icon: '📅' },
            { id: 'grid', name: 'Grid Layout', description: 'Structured diagrams', icon: '⚏' },
            { id: 'sketchplanation', name: 'Sketchplanation', description: 'Visual explanation format', icon: '💡' }
        ];

        const templateGrid = document.getElementById('template-grid');
        if (!templateGrid) return;

        templateGrid.innerHTML = '';
        templates.forEach(template => {
            const card = document.createElement('div');
            card.className = 'template-card';
            card.innerHTML = `
                <div class="template-preview">${template.icon}</div>
                <div class="template-name">${template.name}</div>
                <div class="template-description">${template.description}</div>
            `;
            card.addEventListener('click', () => {
                this.applyTemplate(template.id);
                document.getElementById('template-modal').classList.add('hidden');
            });
            templateGrid.appendChild(card);
        });
    }

    selectTool(tool) {
        this.currentTool = tool;
        
        // Update UI
        document.querySelectorAll('.tool-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        const toolBtn = document.querySelector(`[data-tool="${tool}"]`);
        if (toolBtn) {
            toolBtn.classList.add('active');
        }

        // Update cursor
        this.updateCursor();
        
        // Set default properties for tools
        const toolDefaults = {
            pen: { size: 2, color: '#000000' },
            pencil: { size: 3, color: '#666666' },
            marker: { size: 8, color: '#FF6B35' },
            highlighter: { size: 12, color: '#FFEB3B', opacity: 0.4 },
            eraser: { size: 10 }
        };

        if (toolDefaults[tool]) {
            const defaults = toolDefaults[tool];
            if (defaults.size) {
                this.currentSize = defaults.size;
                const sizeSlider = document.getElementById('size-slider');
                const sizeValue = document.getElementById('size-value');
                if (sizeSlider) sizeSlider.value = defaults.size;
                if (sizeValue) sizeValue.textContent = defaults.size;
            }
            if (defaults.color) {
                this.currentColor = defaults.color;
                const colorInput = document.getElementById('color-input');
                if (colorInput) colorInput.value = defaults.color;
                this.updateColorPresets();
            }
            if (defaults.opacity !== undefined) {
                this.currentOpacity = defaults.opacity;
                const opacitySlider = document.getElementById('opacity-slider');
                const opacityValue = document.getElementById('opacity-value');
                if (opacitySlider) opacitySlider.value = defaults.opacity * 100;
                if (opacityValue) opacityValue.textContent = Math.round(defaults.opacity * 100);
            }
        }
    }

    updateCursor() {
        const cursors = {
            pen: 'crosshair',
            pencil: 'crosshair',
            marker: 'crosshair',
            highlighter: 'crosshair',
            eraser: 'grab',
            line: 'crosshair',
            rectangle: 'crosshair',
            circle: 'crosshair',
            arrow: 'crosshair',
            text: 'text'
        };

        this.canvas.style.cursor = this.isPanMode ? 'move' : (cursors[this.currentTool] || 'crosshair');
    }

    getMousePos(e) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.clientX - rect.left),
            y: (e.clientY - rect.top)
        };
    }

    startDrawing(e) {
        e.preventDefault();
        
        if (this.isPanMode) {
            this.startPanning(e);
            return;
        }

        const pos = this.getMousePos(e);
        this.lastX = pos.x;
        this.lastY = pos.y;

        if (this.currentTool === 'text') {
            this.textPosition = pos;
            document.getElementById('text-modal').classList.remove('hidden');
            return;
        }

        this.isDrawing = true;

        if (['line', 'rectangle', 'circle', 'arrow'].includes(this.currentTool)) {
            this.isShapeDrawing = true;
            this.startX = pos.x;
            this.startY = pos.y;
            this.saveState();
            return;
        }

        this.saveState();
        this.beginPath(pos.x, pos.y);
    }

    draw(e) {
        e.preventDefault();
        
        if (this.isPanMode && this.isPanning) {
            this.updatePan(e);
            return;
        }

        if (!this.isDrawing) return;

        const pos = this.getMousePos(e);

        if (this.isShapeDrawing) {
            this.drawShapePreview(pos.x, pos.y);
            return;
        }

        this.drawLine(this.lastX, this.lastY, pos.x, pos.y);
        this.lastX = pos.x;
        this.lastY = pos.y;
    }

    stopDrawing(e) {
        if (e) e.preventDefault();
        
        if (this.isPanning) {
            this.isPanning = false;
            return;
        }

        if (this.isShapeDrawing) {
            this.isShapeDrawing = false;
            this.isDrawing = false;
        } else if (this.isDrawing) {
            this.isDrawing = false;
        }
        
        this.updateCursor();
    }

    beginPath(x, y) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
        this.ctx.globalAlpha = this.currentOpacity;
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();
        this.ctx.moveTo(x, y);
    }

    drawLine(x1, y1, x2, y2) {
        this.ctx.save();
        this.ctx.globalCompositeOperation = this.currentTool === 'eraser' ? 'destination-out' : 'source-over';
        this.ctx.globalAlpha = this.currentOpacity;
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawShapePreview(x, y) {
        // Restore the canvas to the state before shape preview
        if (this.undoStack.length > 0) {
            const lastState = this.undoStack[this.undoStack.length - 1];
            this.ctx.putImageData(lastState, 0, 0);
        }
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = this.currentOpacity;
        this.ctx.strokeStyle = this.currentColor;
        this.ctx.lineWidth = this.currentSize;
        this.ctx.beginPath();

        switch (this.currentTool) {
            case 'line':
                this.ctx.moveTo(this.startX, this.startY);
                this.ctx.lineTo(x, y);
                break;
            case 'rectangle':
                this.ctx.rect(this.startX, this.startY, x - this.startX, y - this.startY);
                break;
            case 'circle':
                const radius = Math.sqrt(Math.pow(x - this.startX, 2) + Math.pow(y - this.startY, 2));
                this.ctx.arc(this.startX, this.startY, radius, 0, 2 * Math.PI);
                break;
            case 'arrow':
                this.drawArrow(this.startX, this.startY, x, y);
                break;
        }
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawArrow(fromX, fromY, toX, toY) {
        const headLength = Math.max(10, this.currentSize * 2);
        const angle = Math.atan2(toY - fromY, toX - fromX);
        
        // Draw line
        this.ctx.moveTo(fromX, fromY);
        this.ctx.lineTo(toX, toY);
        
        // Draw arrowhead
        this.ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6));
        this.ctx.moveTo(toX, toY);
        this.ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6));
    }

    addText() {
        const textInput = document.getElementById('text-input');
        const fontSizeSlider = document.getElementById('font-size-slider');
        
        if (!textInput || !fontSizeSlider || !this.textPosition) return;
        
        const text = textInput.value;
        const fontSize = fontSizeSlider.value;
        
        if (!text.trim()) return;

        this.saveState();
        
        this.ctx.save();
        this.ctx.globalCompositeOperation = 'source-over';
        this.ctx.globalAlpha = this.currentOpacity;
        this.ctx.fillStyle = this.currentColor;
        this.ctx.font = `${fontSize}px Arial, sans-serif`;
        
        const lines = text.split('\n');
        lines.forEach((line, index) => {
            this.ctx.fillText(line, this.textPosition.x, this.textPosition.y + (index * parseInt(fontSize) * 1.2));
        });
        
        this.ctx.restore();

        document.getElementById('text-modal').classList.add('hidden');
        textInput.value = '';
        this.textPosition = null;
    }

    handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                        e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        this.canvas.dispatchEvent(mouseEvent);
    }

    startPanning(e) {
        this.isPanning = true;
        this.lastPanX = e.clientX;
        this.lastPanY = e.clientY;
        this.canvas.style.cursor = 'grabbing';
    }

    updatePan(e) {
        if (!this.isPanning) return;
        
        const deltaX = e.clientX - this.lastPanX;
        const deltaY = e.clientY - this.lastPanY;
        
        this.panOffset.x += deltaX;
        this.panOffset.y += deltaY;
        
        this.lastPanX = e.clientX;
        this.lastPanY = e.clientY;
        
        this.canvas.style.transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoomLevel})`;
    }

    zoom(factor) {
        this.zoomLevel *= factor;
        this.zoomLevel = Math.max(0.1, Math.min(5, this.zoomLevel));
        
        this.canvas.style.transform = `translate(${this.panOffset.x}px, ${this.panOffset.y}px) scale(${this.zoomLevel})`;
        const zoomLevel = document.getElementById('zoom-level');
        if (zoomLevel) {
            zoomLevel.textContent = Math.round(this.zoomLevel * 100) + '%';
        }
    }

    togglePanMode() {
        this.isPanMode = !this.isPanMode;
        const panBtn = document.getElementById('pan-mode');
        if (panBtn) {
            panBtn.classList.toggle('active', this.isPanMode);
        }
        this.updateCursor();
    }

    toggleGrid() {
        this.isGridVisible = !this.isGridVisible;
        const grid = document.getElementById('canvas-grid');
        if (grid) {
            grid.classList.toggle('visible', this.isGridVisible);
        }
    }

    clearCanvas() {
        this.saveState();
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.pages[this.currentPage] = { strokes: [], zoom: 1, pan: { x: 0, y: 0 } };
    }

    applyTemplate(templateId) {
        this.saveState();
        
        // Clear canvas with white background
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const container = document.getElementById('canvas-container');
        if (container) {
            container.className = 'canvas-container';
            
            switch (templateId) {
                case 'cornell':
                    container.classList.add('cornell-grid');
                    break;
                case 'timeline':
                    container.classList.add('timeline-grid');
                    break;
                case 'grid':
                    container.classList.add('dot-grid');
                    break;
                case 'sketchplanation':
                    container.classList.add('explanation-layout');
                    break;
                case 'mindmap':
                    this.drawMindMapTemplate();
                    break;
            }
        }
    }

    drawMindMapTemplate() {
        this.ctx.save();
        this.ctx.strokeStyle = '#ccc';
        this.ctx.lineWidth = 1;
        this.ctx.setLineDash([5, 5]);
        
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = 50;
        
        // Draw central circle
        this.ctx.beginPath();
        this.ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        this.ctx.stroke();
        
        // Draw branch lines
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI * 2) / 6;
            const x = centerX + Math.cos(angle) * (radius + 100);
            const y = centerY + Math.sin(angle) * (radius + 100);
            
            this.ctx.beginPath();
            this.ctx.moveTo(centerX + Math.cos(angle) * radius, centerY + Math.sin(angle) * radius);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();
        }
        
        this.ctx.restore();
    }

    addNewPage() {
        this.pages.push({ strokes: [], zoom: 1, pan: { x: 0, y: 0 } });
        this.switchToPage(this.pages.length - 1);
        this.updatePageTabs();
    }

    switchToPage(pageIndex) {
        if (pageIndex < 0 || pageIndex >= this.pages.length) return;
        
        this.currentPage = pageIndex;
        this.clearCanvas();
        this.updatePageTabs();
    }

    updatePageTabs() {
        const tabsList = document.getElementById('tabs-list');
        if (!tabsList) return;
        
        tabsList.innerHTML = '';
        
        this.pages.forEach((page, index) => {
            const tab = document.createElement('div');
            tab.className = 'tab' + (index === this.currentPage ? ' active' : '');
            tab.dataset.page = index;
            tab.innerHTML = `
                <span class="tab-name">Page ${index + 1}</span>
                ${this.pages.length > 1 ? '<button class="tab-close">×</button>' : ''}
            `;
            
            tab.addEventListener('click', (e) => {
                if (!e.target.classList.contains('tab-close')) {
                    this.switchToPage(index);
                }
            });
            
            if (this.pages.length > 1) {
                const closeBtn = tab.querySelector('.tab-close');
                if (closeBtn) {
                    closeBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.closePage(index);
                    });
                }
            }
            
            tabsList.appendChild(tab);
        });
    }

    closePage(pageIndex) {
        if (this.pages.length <= 1) return;
        
        this.pages.splice(pageIndex, 1);
        if (this.currentPage >= pageIndex && this.currentPage > 0) {
            this.currentPage--;
        }
        this.switchToPage(this.currentPage);
    }

    saveState() {
        const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        this.undoStack.push(imageData);
        this.redoStack = [];
        
        // Limit undo stack size
        if (this.undoStack.length > 20) {
            this.undoStack.shift();
        }
    }

    undo() {
        if (this.undoStack.length > 1) {
            this.redoStack.push(this.undoStack.pop());
            const previousState = this.undoStack[this.undoStack.length - 1];
            this.ctx.putImageData(previousState, 0, 0);
        }
    }

    redo() {
        if (this.redoStack.length > 0) {
            const nextState = this.redoStack.pop();
            this.undoStack.push(nextState);
            this.ctx.putImageData(nextState, 0, 0);
        }
    }

    handleKeyboard(e) {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
        
        switch (e.key.toLowerCase()) {
            case 'b':
                e.preventDefault();
                this.selectTool('pen');
                break;
            case 'e':
                e.preventDefault();
                this.selectTool('eraser');
                break;
            case 't':
                e.preventDefault();
                this.selectTool('text');
                break;
            case ' ':
                e.preventDefault();
                this.togglePanMode();
                break;
            case '=':
            case '+':
                e.preventDefault();
                this.zoom(1.2);
                break;
            case '-':
                e.preventDefault();
                this.zoom(0.8);
                break;
        }
        
        if (e.ctrlKey || e.metaKey) {
            switch (e.key.toLowerCase()) {
                case 'z':
                    e.preventDefault();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    break;
                case 'y':
                    e.preventDefault();
                    this.redo();
                    break;
            }
        }
    }

    exportAs(format) {
        const link = document.createElement('a');
        
        switch (format) {
            case 'png':
                link.download = 'sketchnotes.png';
                link.href = this.canvas.toDataURL('image/png');
                break;
            case 'svg':
                // Simple SVG export fallback
                link.download = 'sketchnotes.png';
                link.href = this.canvas.toDataURL('image/png');
                break;
            case 'pdf':
                // Simple PDF export fallback
                link.download = 'sketchnotes.png';
                link.href = this.canvas.toDataURL('image/png');
                break;
        }
        
        link.click();
        document.getElementById('export-modal').classList.add('hidden');
    }

    newNotebook() {
        if (confirm('Create a new notebook? This will clear all current pages.')) {
            this.pages = [{ strokes: [], zoom: 1, pan: { x: 0, y: 0 } }];
            this.currentPage = 0;
            this.clearCanvas();
            this.updatePageTabs();
        }
    }

    updateUI() {
        this.updatePageTabs();
        this.selectTool('pen');
        this.updateColorPresets();
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SketchNotesApp();
});