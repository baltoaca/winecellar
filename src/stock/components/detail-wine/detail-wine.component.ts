import {WineSearch} from "../../containers/wine-search/wine-search.container";
import {Product} from "../../WineComApiTypes";
import {Wine} from "../../entities/Wine";
import {Rating} from "./../rating/rating.component";
import {Component, ChangeDetectionStrategy, EventEmitter, Input, Output} from "angular2/core";
import {ROUTER_DIRECTIVES} from "angular2/router";
import {Control, Validators, ControlGroup} from "angular2/common";
import {FormGroupTextbox} from "../../../common/components/form/form-group-textbox/form-group-textbox.component";
import {FormGroupFooter} from "../../../common/components/form/form-group-footer/form-group-footer.component";
import {NumberPicker} from "../number-picker/number-picker.component";
import {FormGroupTextarea} from "../../../common/components/form/form-group-textarea/form-group-textarea.component";
@Component({
    selector: "detail-wine",
    changeDetection: ChangeDetectionStrategy.OnPush,
    directives: [FormGroupTextbox, FormGroupTextarea, FormGroupFooter, ROUTER_DIRECTIVES, WineSearch, Rating, NumberPicker],
    template: `
        <form [ngFormModel]="wineForm" class="form-horizontal col-sm-12" (ngSubmit)="onSubmit()">
            <wine-search [control]="wineForm.controls['name']" (onSelect)="onSelect($event)"></wine-search>
            <form-group-textarea 
                [label]="'Description'" 
                [control]="wineForm.controls['description']" 
                [placeholder]="'Enter description'">
            </form-group-textarea>    
            <form-group-textbox 
                [label]="'Region'" 
                [control]="wineForm.controls['region']" 
                [placeholder]="'Enter region'">
            </form-group-textbox>    
            <form-group-textbox 
                [label]="'Price'" 
                [control]="wineForm.controls['price']" 
                [placeholder]="'Enter price'">
            </form-group-textbox>    
            <div class="form-group has-feedback">
                 <label class="col-sm-4 control-label">Rating</label>
                 <div class="col-sm-8">
                    <rating [big]="true" [rating]="wine.myRating" (setRate)="setRate($event)"></rating>
                </div>
            </div>
            <div class="form-group has-feedback">
                 <label class="col-sm-4 control-label">Number in stock</label>
                 <div class="col-sm-8">
                    <number-picker [amount]="wine.inStock" (setAmount)="setInStock($event)"></number-picker>
                </div>
            </div>
            <div class="form-group has-feedback">
                 <div class=" col-sm-offset-4 col-sm-8">
                    <img src="{{wine.image}}" alt=""/>
                </div>
            </div>
            <form-group-footer>
                 <button 
                    type="submit" 
                    [disabled]="!wineForm.valid" 
                    class="btn btn-primary btn-lg">
                    <i class="fa fa-save"></i>&nbsp;Save wine
                </button>
                <a [routerLink]="['MyWines']"
                    class="btn btn-warning btn-lg"><i class="fa fa-undo"></i>&nbsp;Cancel</a>
            </form-group-footer>
        </form>
     `
})
export class DetailWine {
    @Output()
    public onSave: EventEmitter<Wine>;

    @Input()
    public wine: Wine;

    public wineForm: ControlGroup;

    constructor() {
        this.onSave = new EventEmitter();
    }

    public ngOnInit(): void {
        this.wine = this.wine ? <Wine>_.assign({}, this.wine) : new Wine();
        this.wineForm = new ControlGroup({
            "name": new Control(this.wine.name, Validators.required),
            "description": new Control(this.wine.description),
            "region": new Control(this.wine.region),
            "price": new Control(this.wine.price)
        });
    }

    public onSubmit(): void {
        this.wine.name = this.wineForm.value.name;
        this.wine.description = this.wineForm.value.description;
        this.wine.region = this.wineForm.value.region;
        this.wine.price = this.wineForm.value.price;

        this.onSave.emit(this.wine);
    }

    public setRate(rate: number): void {
        this.wine.myRating = rate;
    }

    public setInStock(inStock: number): void {
        this.wine.inStock = inStock;
    }

    public onSelect(wine: Product): void {
        (<Control>this.wineForm.controls["name"]).updateValue(wine.name);
        (<Control>this.wineForm.controls["description"]).updateValue(wine.description);
        (<Control>this.wineForm.controls["price"]).updateValue(wine.priceRetail);
        (<Control>this.wineForm.controls["region"]).updateValue(wine.appellation.region.name);
        this.wine.image = wine.labels.length > 0 ? wine.labels[0].url : null;
    }
}