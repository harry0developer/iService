import { of } from "rxjs";
import { distinct } from "rxjs/operators";

export const filterUnique = (array) => {
    return array.filter((v, i, a) => a.indexOf(v) === i);
}

export const filter = () => {
    of<any>(
        { age: 4, name: 'Foo' },
        { age: 7, name: 'Bar' },
        { age: 5, name: 'Foo' },
    ).pipe(
        distinct((p: any) => p.name),
    )
        .subscribe(x => console.log(x));
}