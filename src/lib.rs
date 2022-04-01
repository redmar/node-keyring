use neon::prelude::*;

fn get_password(mut cx: FunctionContext) -> JsResult<JsString> {
    let service = cx.argument::<JsString>(0)?.value(&mut cx);
    let username = cx.argument::<JsString>(1)?.value(&mut cx);
    let entry = keyring::Entry::new(&service, &username);
    let password = entry
        .get_password()
        .or_else(|err| cx.throw_error(err.to_string()))?;

    Ok(cx.string(&password))
}

fn set_password(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let service = cx.argument::<JsString>(0)?.value(&mut cx);
    let username = cx.argument::<JsString>(1)?.value(&mut cx);
    let password = cx.argument::<JsString>(2)?.value(&mut cx);

    let entry = keyring::Entry::new(&service, &username);
    entry
        .set_password(&password)
        .or_else(|err| cx.throw_error(err.to_string()))?;

    Ok(cx.undefined())
}

fn delete_password(mut cx: FunctionContext) -> JsResult<JsUndefined> {
    let service = cx.argument::<JsString>(0)?.value(&mut cx);
    let username = cx.argument::<JsString>(1)?.value(&mut cx);
    let entry = keyring::Entry::new(&service, &username);
    entry
        .delete_password()
        .or_else(|err| cx.throw_error(err.to_string()))?;

    Ok(cx.undefined())
}

#[neon::main]
fn main(mut cx: ModuleContext) -> NeonResult<()> {
    cx.export_function("getPassword", get_password)?;
    cx.export_function("setPassword", set_password)?;
    cx.export_function("deletePassword", delete_password)?;
    Ok(())
}
