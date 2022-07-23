@Component({
  selector: "my-app",
  template: `
<div style="height: 100%; box-sizing: border-box;">
    <ag-grid-angular
    #agGrid
    style="width: 100%; height: 100%;"
    id="myGrid"
    class="ag-theme-balham"
    [columnDefs]="columnDefs"
    [rowData]="rowData"
    [editType]="editType"
    [frameworkComponents]="frameworkComponents"
    (gridReady)="onGridReady($event)"
    (cellClicked)="onCellClicked($event)"
    [defaultColDef] = "defaultColDef"
    [immutableColumns] = "true"
    suppressClickEdit
    ></ag-grid-angular>
</div>
`
})
export class AppComponent {
  private gridApi;
  private gridColumnApi;

  private columnDefs;
  private rowData;
  private context;
  private frameworkComponents;
    private editType;
    private defaultColDef;

  constructor() {
    this.columnDefs = [
      {
        headerName: "Row",
           editable: true,
        field: "row",
        width: 150
      },
      {
        headerName: "value1",
        field: "value1",
        editable: true,
        width: 150
      },
      {
        headerName: "value2",
        field: "value2",
           editable: true,
        width: 150
      },
      {
        headerName: "value3",
        field: "value3",
           editable: true,
        width: 150
      },
      {
        headerName: "Currency (Pipe)",
        field: "currency",
           editable: true,
        width: 100
      },
      {
        headerName: "Actions",
        field: "action",
        cellRenderer: "rowEditCRenderer",
        cellRendererParams: {
          cancelOtherRowEditors: this.cancelOtherRowEditors.bind(this)
        },
        width: 180
      }
    ];
    
    this.rowData = createRowData();
    this.editType = "fullRow";
    
    this.frameworkComponents = {
    rowEditCRenderer: rowEditComponent
   
    };
    
    this.defaultColDef = {
            sortingOrder: ["asc", "desc"],
            stopEditingWhenGridLosesFocus: false,
            sortable:true,
            enableFilter: true,
            suppressKeyboardEvent: function (event) {
                if(!event.editing || event.event.code === "Enter")
                return true;
            }
        };
  }

  cancelOtherRowEditors(currentRowIndex) {
    const renderers = this.gridApi.getCellRendererInstances();
    renderers.forEach(function(renderer) {
      if(!renderer._agAwareComponent.isNew && 
        currentRowIndex !== renderer._params.node.rowIndex) {
        renderer._agAwareComponent.onCancelClick();
      }
    });
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.gridColumnApi = params.columnApi;

  }

  onCellClicked(params) {
    if(params.node.field !== 'action') {
      this.cancelOtherRowEditors(params.node.rowIndex);
    }
  }
}

function createRowData() {
  var rowData = [];
  for (var i = 0; i < 15; i++) {
    rowData.push({
      row: "Row " + i,
      value1: i,
      value2: i +10,
        value3: i +30,
      currency: i + Number(Math.random().toFixed(2))
    });
  }
  return rowData;
}
